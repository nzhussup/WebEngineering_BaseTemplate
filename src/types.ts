export interface Bear {
  readonly name: string;
  readonly binomial: string;
  readonly fileName: string;
  readonly range: string;
}

export interface BearCard {
  readonly bear: Bear;
  readonly card: HTMLDivElement;
  readonly image: HTMLImageElement;
}
