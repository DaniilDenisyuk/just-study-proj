'use strict';

const { Pool } = require('pg');

const OPERATORS = ['>=', '<=', '<>', '>', '<'];

const where = (conditions, firstArgIndex = 1, table = null) => {
  const clause = [];
  const args = [];
  let i = firstArgIndex;
  const keys = Object.keys(conditions);
  for (const key of keys) {
    let operator = '=';
    let value = conditions[key];
    if (typeof value === 'string') {
      for (const op of OPERATORS) {
        const len = op.length;
        if (value.startsWith(op)) {
          operator = op;
          value = value.substring(len);
        }
      }
      if (value.includes('*') || value.includes('?')) {
        operator = 'LIKE';
        value = value.replace(/\*/g, '%').replace(/\?/g, '_');
      }
    }
    let sqlKey = key;
    if (table) {
      sqlKey = `${table}.${sqlKey}`;
    }
    clause.push(`${sqlKey} ${operator} $${i++}`);
    args.push(value);
  }
  return { clause: clause.join(' AND '), args, i };
};

const updates = (delta, firstArgIndex = 1) => {
  const clause = [];
  const args = [];
  let i = firstArgIndex;
  const keys = Object.keys(delta);
  for (const key of keys) {
    const value = delta[key].toString();
    clause.push(`${key} = $${i++}`);
    args.push(value);
  }
  return { clause: clause.join(', '), args };
};

class Database {
  constructor(config) {
    this.pool = new Pool(config);
  }

  query(sql, values) {
    return this.pool.query(sql, values);
  }

  insert(table, record) {
    const keys = Object.keys(record);
    const nums = new Array(keys.length);
    const data = new Array(keys.length);
    let i = 0;
    for (const key of keys) {
      data[i] = record[key];
      nums[i] = `$${++i}`;
    }
    const fields = keys.join(', ');
    const params = nums.join(', ');
    const sql = `INSERT INTO ${table} (${fields}) VALUES (${params})`;
    return this.query(sql, data);
  }

  async selectInnerJoin(instruction, { sort, limit, offset }) {
    const sqlFields = [];
    const sqlConditions = [];
    const args = [];
    let i = 1;
    const tables = Object.keys(instruction);
    for (const table of tables) {
      const { fields = ['*'], conditions = null } = instruction[table];
      sqlFields.push(...fields.map(item => `${table}.${item}`));
      if (conditions) {
        const whereData = where(conditions, i, table);
        sqlConditions.push(whereData.clause);
        args.push(...whereData.args);
        i += whereData.i;
      }
    }
    // eslint-disable-next-line max-len
    const sql = `SELECT ${sqlFields.join(', ')} FROM ${tables.join(' JOIN ')} ON ${sqlConditions.join(' AND ')}`;
    const filters = [];
    if (sort) {
      filters.push(' ORDER BY');
      const fields = sort.split(',');
      let count = fields.length;
      for (const field of fields) {
        const order = field.charAt(0) === '-' ? 'DESC' : 'ASC';
        filters.push(`${field.substring(1)} ${order}`);
        count--;
        if (count > 0) filters.push(',');
      }
    }
    if (limit) {
      filters.push(`LIMIT $${i++}`);
      args.push(limit);
    }
    if (offset) {
      filters.push(`OFFSET $${i++}`);
      args.push(offset);
    }
    console.log(sql + filters.join(' '));
    console.log(args);
    const res = await this.query(sql + filters.join(' '), args);
    return res.rows;
  }
  // eslint-disable-next-line max-len
  async select(table, { sort, limit, offset }, fields = ['*'], conditions = null) {
    const keys = fields.join(', ');
    const sql = `SELECT ${keys} FROM ${table}`;
    let whereClause = '';
    let args = [];
    let i = 1;
    if (conditions) {
      const whereData = where(conditions, i);
      whereClause = ' WHERE ' + whereData.clause;
      args = whereData.args;
      i += whereData.i;
    }
    const filters = [];
    if (sort) {
      filters.push('ORDER BY');
      const fields = sort.split(',');
      let count = fields.length;
      for (const field of fields) {
        const order = field.charAt(0) === '-' ? 'DESC' : 'ASC';
        filters.push(`${field.substring(1)} ${order}`);
        count--;
        if (count > 0) filters.push(',');
      }
    }
    if (limit) {
      filters.push(`LIMIT $${i++}`);
      args.push(limit);
    }
    if (offset) {
      filters.push(`OFFSET $${i++}`);
      args.push(offset);
    }
    const res = await this.query(sql + whereClause + filters.join(' '), args);
    return res.rows;
  }

  delete(table, conditions = null) {
    const { clause, args } = where(conditions);
    const sql = `DELETE FROM ${table} WHERE ${clause}`;
    return this.query(sql, args);
  }

  update(table, delta = null, conditions = null) {
    const upd = updates(delta);
    const cond = where(conditions, upd.args.length + 1);
    const sql = `UPDATE ${table} SET ${upd.clause} WHERE ${cond.clause}`;
    const args = [...upd.args, ...cond.args];
    return this.query(sql, args);
  }

  close() {
    this.pool.end();
  }
}

module.exports = Database;
