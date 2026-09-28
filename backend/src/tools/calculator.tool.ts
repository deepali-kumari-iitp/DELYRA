export function calculator(expression: string): number {
  const cleanedExpression = expression.replace(/\s+/g, "");

  if (!/^[0-9+\-*/().]+$/.test(cleanedExpression)) {
    throw new Error("Invalid mathematical expression");
  }

  try {
    const result = Function(
      `"use strict"; return (${cleanedExpression})`
    )();

    if (typeof result !== "number" || !Number.isFinite(result)) {
      throw new Error("Invalid calculation");
    }

    return result;
  } catch {
    throw new Error("Unable to calculate the expression");
  }
}