// Code from: https://github.com/animir/node-rate-limiter-flexible/blob/d070b20cadca8b17246653d851256ee5f859f35b/lib/RateLimiterMySQL.js.
// TODO: Replace with RateLimiterRedis.

// eslint-disable-next-line @typescript-eslint/no-var-requires
const RateLimiterStoreAbstract = require('rate-limiter-flexible/lib/RateLimiterStoreAbstract');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const RateLimiterRes = require('rate-limiter-flexible/lib/RateLimiterRes');

export class RateLimiterMariaDb extends RateLimiterStoreAbstract {
	/**
	 * @callback callback
	 * @param {Object} err
	 *
	 * @param {Object} opts
	 * @param {callback} cb
	 * Defaults {
	 *   ... see other in RateLimiterStoreAbstract
	 *
	 *   storeClient: anySqlClient,
	 *   storeType: 'knex', // required only for Knex instance
	 *   dbName: 'string',
	 *   tableName: 'string',
	 * }
	 */
	constructor(opts: any, cb: any = null) {
		super(opts);

		this.client = opts.storeClient;
		this.clientType = opts.storeType;

		this.dbName = opts.dbName;
		this.tableName = opts.tableName;

		this.clearExpiredByTimeout = opts.clearExpiredByTimeout;

		this.tableCreated = opts.tableCreated;
		if (!this.tableCreated) {
			this._createDbAndTable()
				.then(() => {
					this.tableCreated = true;
					if (this.clearExpiredByTimeout) {
						this._clearExpiredHourAgo();
					}
					if (typeof cb === 'function') {
						cb();
					}
				})
				.catch((err) => {
					if (typeof cb === 'function') {
						cb(err);
					} else {
						throw err;
					}
				});
		} else {
			if (this.clearExpiredByTimeout) {
				this._clearExpiredHourAgo();
			}
			if (typeof cb === 'function') {
				cb();
			}
		}
	}

	clearExpired(expire: any): any {
		return new Promise((resolve: any) => {
			this._getConnection()
				.then((conn) => {
					conn.query(
						`DELETE FROM ${conn.escapeId(
							this.dbName,
						)}.${conn.escapeId(this.tableName)} WHERE expire < ?`,
						[expire],
						() => {
							this._releaseConnection(conn);
							resolve();
						},
					);
				})
				.catch(() => {
					resolve();
				});
		});
	}

	_clearExpiredHourAgo(): any {
		if (this._clearExpiredTimeoutId) {
			clearTimeout(this._clearExpiredTimeoutId);
		}
		this._clearExpiredTimeoutId = setTimeout(() => {
			this.clearExpired(Date.now() - 3600000) // Never rejected
				.then(() => {
					this._clearExpiredHourAgo();
				});
		}, 300000);
		this._clearExpiredTimeoutId.unref();
	}

	/**
	 *
	 * @return Promise<any>
	 * @private
	 */
	_getConnection(): Promise<any> {
		switch (this.clientType) {
			case 'pool':
				return new Promise((resolve, reject) => {
					this.client.getConnection((errConn: any, conn: any) => {
						if (errConn) {
							return reject(errConn);
						}

						resolve(conn);
					});
				});
			case 'sequelize':
				return this.client.connectionManager.getConnection();
			case 'knex':
				return this.client.client.acquireConnection();
			default:
				return Promise.resolve(this.client);
		}
	}

	_releaseConnection(conn: any): any {
		switch (this.clientType) {
			case 'pool':
				return conn.release();
			case 'sequelize':
				return this.client.connectionManager.releaseConnection(conn);
			case 'knex':
				return this.client.client.releaseConnection(conn);
			default:
				return true;
		}
	}

	/**
	 *
	 * @returns {Promise<any>}
	 * @private
	 */
	_createDbAndTable(): Promise<any> {
		return new Promise((resolve: any, reject) => {
			this._getConnection()
				.then((conn) => {
					conn.query(
						`CREATE DATABASE IF NOT EXISTS \`${this.dbName}\`;`,
						(errDb: any) => {
							if (errDb) {
								this._releaseConnection(conn);
								return reject(errDb);
							}
							conn.query(
								this._getCreateTableStmt(),
								(err: any) => {
									if (err) {
										this._releaseConnection(conn);
										return reject(err);
									}
									this._releaseConnection(conn);
									resolve();
								},
							);
						},
					);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	_getCreateTableStmt(): any {
		return (
			`CREATE TABLE IF NOT EXISTS \`${this.dbName}\`.\`${this.tableName}\` (` +
			'`key` VARCHAR(255) CHARACTER SET utf8 NOT NULL,' +
			'`points` INT(9) NOT NULL default 0,' +
			'`expire` BIGINT UNSIGNED,' +
			'PRIMARY KEY (`key`)' +
			') ENGINE = INNODB;'
		);
	}

	get clientType(): any {
		return this._clientType;
	}

	set clientType(value) {
		if (typeof value === 'undefined') {
			if (this.client.constructor.name === 'Connection') {
				value = 'connection';
			} else if (this.client.constructor.name === 'Pool') {
				value = 'pool';
			} else if (this.client.constructor.name === 'Sequelize') {
				value = 'sequelize';
			} else {
				throw new Error('storeType is not defined');
			}
		}
		this._clientType = value.toLowerCase();
	}

	get dbName(): any {
		return this._dbName;
	}

	set dbName(value) {
		this._dbName = typeof value === 'undefined' ? 'rtlmtrflx' : value;
	}

	get tableName(): any {
		return this._tableName;
	}

	set tableName(value) {
		this._tableName = typeof value === 'undefined' ? this.keyPrefix : value;
	}

	get tableCreated(): any {
		return this._tableCreated;
	}

	set tableCreated(value) {
		this._tableCreated = typeof value === 'undefined' ? false : !!value;
	}

	get clearExpiredByTimeout(): any {
		return this._clearExpiredByTimeout;
	}

	set clearExpiredByTimeout(value) {
		this._clearExpiredByTimeout =
			typeof value === 'undefined' ? true : Boolean(value);
	}

	_getRateLimiterRes(rlKey: any, changedPoints: any, result: any): any {
		const res = new RateLimiterRes();
		const [row] = result;

		res.isFirstInDuration = changedPoints === row.points;
		res.consumedPoints = res.isFirstInDuration ? changedPoints : row.points;

		res.remainingPoints = Math.max(this.points - res.consumedPoints, 0);
		res.msBeforeNext = row.expire
			? Math.max(row.expire - Date.now(), 0)
			: -1;

		return res;
	}

	_upsertTransaction(
		conn: any,
		key: any,
		points: any,
		msDuration: any,
		forceExpire: any,
	): any {
		return new Promise((resolve, reject) => {
			conn.query('BEGIN', (errBegin: any) => {
				if (errBegin) {
					conn.rollback();

					return reject(errBegin);
				}

				const dateNow = Date.now();
				const newExpire = msDuration > 0 ? dateNow + msDuration : null;

				let q;
				let values;
				if (forceExpire) {
					q = `INSERT INTO ${conn.escapeId(
						this.dbName,
					)}.${conn.escapeId(this.tableName)} VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE
            points = ?,
            expire = ?;`;
					values = [key, points, newExpire, points, newExpire];
				} else {
					q = `INSERT INTO ${conn.escapeId(
						this.dbName,
					)}.${conn.escapeId(this.tableName)} VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE
            points = IF(expire <= ?, ?, points + (?)),
            expire = IF(expire <= ?, ?, expire);`;
					values = [
						key,
						points,
						newExpire,
						dateNow,
						points,
						points,
						dateNow,
						newExpire,
					];
				}

				conn.query(q, values, (errUpsert: any) => {
					if (errUpsert) {
						conn.rollback();

						return reject(errUpsert);
					}
					conn.query(
						`SELECT points, expire FROM ${conn.escapeId(
							this.dbName,
						)}.${conn.escapeId(this.tableName)} WHERE \`key\` = ?;`,
						[key],
						(errSelect: any, res: any) => {
							if (errSelect) {
								conn.rollback();

								return reject(errSelect);
							}

							conn.query('COMMIT', (err: any) => {
								if (err) {
									conn.rollback();

									return reject(err);
								}

								resolve(res);
							});
						},
					);
				});
			});
		});
	}

	_upsert(key: any, points: any, msDuration: any, forceExpire = false): any {
		if (!this.tableCreated) {
			return Promise.reject(Error('Table is not created yet'));
		}

		return new Promise((resolve, reject) => {
			this._getConnection()
				.then((conn) => {
					this._upsertTransaction(
						conn,
						key,
						points,
						msDuration,
						forceExpire,
					)
						.then((res: any) => {
							resolve(res);
							this._releaseConnection(conn);
						})
						.catch((err: any) => {
							reject(err);
							this._releaseConnection(conn);
						});
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	_get(rlKey: any): any {
		if (!this.tableCreated) {
			return Promise.reject(Error('Table is not created yet'));
		}

		return new Promise((resolve, reject) => {
			this._getConnection()
				.then((conn) => {
					conn.query(
						`SELECT points, expire FROM ${conn.escapeId(
							this.dbName,
						)}.${conn.escapeId(
							this.tableName,
						)} WHERE \`key\` = ? AND (\`expire\` > ? OR \`expire\` IS NULL)`,
						[rlKey, Date.now()],
						(err: any, res: any) => {
							if (err) {
								reject(err);
							} else if (res.length === 0) {
								resolve(null);
							} else {
								resolve(res);
							}

							this._releaseConnection(conn);
						}, // eslint-disable-line
					);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	_delete(rlKey: any): any {
		if (!this.tableCreated) {
			return Promise.reject(Error('Table is not created yet'));
		}

		return new Promise((resolve, reject) => {
			this._getConnection()
				.then((conn) => {
					conn.query(
						`DELETE FROM ${conn.escapeId(
							this.dbName,
						)}.${conn.escapeId(this.tableName)} WHERE \`key\` = ?`,
						[rlKey],
						(err: any, res: any) => {
							if (err) {
								reject(err);
							} else {
								resolve(res.affectedRows > 0);
							}

							this._releaseConnection(conn);
						}, // eslint-disable-line
					);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
}
