export interface ThemeToggleProps {
  onToggle: () => void;
  isDark: boolean;
  alternate?: boolean;
  lightIcon?: React.ReactNode;
  darkIcon?: React.ReactNode;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  onToggle,
  isDark,
  alternate = false,
  lightIcon,
  darkIcon,
}) => {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label="Toggle theme"
    >
      <div className="theme-toggle-content">
        {alternate ? (
          isDark ? (
            darkIcon
          ) : (
            lightIcon
          )
        ) : (
          <>
            {lightIcon}
            {darkIcon}
          </>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;