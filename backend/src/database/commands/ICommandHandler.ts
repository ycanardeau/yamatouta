import { Injectable } from '@nestjs/common';

export interface ICommandHandler<T> {
	execute(command: T): Promise<any>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CommandHandler = <T>(_: T): ClassDecorator => Injectable();
