export function getDescriptionByScore(score: number) {
  /**
   
不合格： 总分 < 60

待改善： 60 ≤ 总分 < 90

优秀： 90 ≤ 总分 < 99

完美： 总分 ≥ 99
   */
  if (score < 60) {
    return "很遗憾";
  } else if (score < 90) {
    return "还需努力";
  } else if (score < 99) {
    return "恭喜你";
  } else {
    return "完美";
  }
}
