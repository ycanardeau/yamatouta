import { Injectable } from '@nestjs/common';

export interface IQueryHandler<T> {
	execute(command: T): Promise<any>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const QueryHandler = <T>(_: T): ClassDecorator => Injectable();
