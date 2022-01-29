export class FakeEntityManager {
	transactional<T>(cb: () => Promise<T>): Promise<T> {
		return cb();
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	persist(): void {}
}
