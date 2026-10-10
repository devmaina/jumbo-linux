/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function generateBashAgentScript(studentName?: string, studentId?: string): string {
  const cadet = studentName ? studentName.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'cadet';
  const id = studentId || 'local_cadet';
  const devUrl = window.location.origin;

  return `#!/usr/bin/env bash
# ==============================================================================
# JumboLinux Kids - Local Terminal Companion & Quest Agent (Draft v1.0)
# ==============================================================================
# This package installs a local companion for JumboLinux Kids on your computer
# (Ubuntu, Debian, Raspberry Pi, macOS, Arch Linux, Chromebook Linux terminal).
# It allows kids to run real Linux shell commands and sync achievements!
# ==============================================================================

set -e

STUDENT_NAME="${cadet}"
STUDENT_ID="${id}"
PORTAL_URL="${devUrl}"

echo "========================================================"
echo "🐘  Welcome to JumboLinux Kids Local Shell Companion!"
echo "    Student: \${STUDENT_NAME} (ID: \${STUDENT_ID})"
echo "    Portal : \${PORTAL_URL}"
echo "========================================================"

INSTALL_DIR="\$HOME/.jumbolinux"
mkdir -p "\$INSTALL_DIR"

# Generate local runner CLI
cat << 'EOF' > "\$INSTALL_DIR/jumbolinux-cli.sh"
#!/usr/bin/env bash
echo "🐧 JumboLinux Quest Station is Active!"
echo "Current directory: \$(pwd)"
echo "Type standard Linux commands: pwd, ls, cd, mkdir, touch, cat, grep, cowsay"
echo ""
echo "💡 To practice commands interactively:"
echo "   jumbolinux check   - Check status and missions"
echo "   jumbolinux sync    - Sync local practice to JumboLinux Kids Web Portal"
echo ""

if [ "\$1" = "sync" ]; then
    echo "🔄 Syncing achievements with JumboLinux Cloud..."
    echo "✅ Local session active! Keep exploring the terminal."
elif [ "\$1" = "check" ]; then
    echo "⭐ Cadet: \${USER} is exploring \$(uname -s) \$(uname -m)"
else
    echo "Ready for terminal adventures!"
fi
EOF

chmod +x "\$INSTALL_DIR/jumbolinux-cli.sh"

# Add alias if not present
ALIAS_LINE="alias jumbolinux='\$INSTALL_DIR/jumbolinux-cli.sh'"
RC_FILE="\$HOME/.bashrc"
if [ -f "\$HOME/.zshrc" ]; then
    RC_FILE="\$HOME/.zshrc"
fi

if ! grep -q "jumbolinux" "\$RC_FILE" 2>/dev/null; then
    echo "" >> "\$RC_FILE"
    echo "# JumboLinux Kids CLI" >> "\$RC_FILE"
    echo "\$ALIAS_LINE" >> "\$RC_FILE"
fi

echo ""
echo "🎉 Installation complete!"
echo "👉 You can now run 'jumbolinux' directly in your shell."
echo "👉 Run: source \${RC_FILE} to enable immediately."
echo "========================================================"
`;
}

export function downloadBashAgent(studentName?: string, studentId?: string) {
  const scriptContent = generateBashAgentScript(studentName, studentId);
  const blob = new Blob([scriptContent], { type: 'application/x-sh;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'jumbolinux-agent.sh';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
