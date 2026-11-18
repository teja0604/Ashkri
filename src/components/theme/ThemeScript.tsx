export function ThemeScript() {
  const code = `
    (function() {
      try {
        var mode = localStorage.getItem('ashkri-theme-mode') || 'system';
        var resolvedTheme = 'light';
        if (mode === 'dark') {
          resolvedTheme = 'dark';
        } else if (mode === 'light') {
          resolvedTheme = 'light';
        } else {
          resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', resolvedTheme);
        document.documentElement.setAttribute('data-theme-mode', mode);
      } catch (e) {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.setAttribute('data-theme-mode', 'system');
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

