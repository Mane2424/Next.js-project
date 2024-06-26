export interface PipelineType {
	id: number;
	name: string;
	purpose: string;
	purposeId: string;
	entityTypeSysId?: string | null;
	entityTypeId?: string | null;
	contractGroupId?: string | null;
}
