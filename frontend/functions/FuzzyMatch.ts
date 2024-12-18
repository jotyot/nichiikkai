function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;

  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      if (i === 0) {
        dp[i][j] = j;
      } else if (j === 0) {
        dp[i][j] = i;
      } else if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

export function FuzzyMatch(input: string, targets: string[]): boolean {
  for (const target of targets) {
    let threshold = input.length * 0.35;
    const distance = levenshteinDistance(input, target);
    if (input.length === 1) threshold = 0;
    if (input.length === 2) threshold = 1;
    if (distance <= threshold) {
      return true;
    }
  }
  return false;
}
