export interface Interval {
  startTime: string;
  endTime: string;
}

export interface RequestUser {
  id: number;
  email: string;
}

export interface UseCase<TInput = void, TOutput = void> {
  execute(input: TInput): Promise<TOutput> | TOutput;
}
