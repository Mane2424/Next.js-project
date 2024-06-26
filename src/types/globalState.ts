export interface IGlobalState<T> {
	data: T | null;
	isLoading: boolean;
	isSuccess: boolean;
	isError: boolean;
}
