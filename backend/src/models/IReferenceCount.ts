export interface IReferenceCount {
	referenceCount: number;
	incrementReferenceCount(): void;
	decrementReferenceCount(): void;
}
