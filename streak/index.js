class StreakPlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
  }

  async onEnable() {
    this.hooks.on('onHabitComplete', (habit) => {
      const name = habit && (habit.treeName || habit.name) ? (habit.treeName || habit.name) : 'Habit';
      const streak = habit && habit.currentStreak ? habit.currentStreak : 1;
      const milestones = new Set([7, 30, 100, 365]);
      let text = streak > 1 ? `${name} — ${streak} day streak!` : `${name} completed today!`;
      if (milestones.has(streak)) {
        text = `${name} hit ${streak} days. Milestone reached!`;
      }
      this.context.ui.showNotification('', text);
    });
  }

  onDisable() {}
}

return new StreakPlugin(context, hooks);
