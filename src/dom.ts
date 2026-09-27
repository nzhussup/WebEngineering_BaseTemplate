export function requireElement<T extends Element>(
  selector: string,
  elementType: { new (): T },
  root: ParentNode = document
): T {
  const element = root.querySelector(selector);
  if (!(element instanceof elementType)) {
    throw new Error('Missing or incorrect element: ' + selector);
  }
  return element;
}
