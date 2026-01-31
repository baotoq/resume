# External Integrations

> Auto-generated codebase map - Last updated: 2026-01-31

## Third-Party Services

### None Currently

This is a static resume website with no external API integrations or backend services.

## Browser APIs Used

### Print API
- **Purpose**: PDF export functionality
- **Implementation**: `react-to-print` library wraps browser's native print dialog
- **Location**: `src/components/ui/PDFExportButton.tsx`
- **Trigger**: User clicks download button → Opens print dialog → Save as PDF

## Static Assets

### Google Fonts
- **Font**: Inter
- **Loading**: Via `next/font/google`
- **Location**: `src/app/layout.tsx`

### Icons
- **Source**: Ant Design Icons (@ant-design/icons)
- **Usage**: Contact info icons, section headers
- **Icons Used**: MailOutlined, PhoneOutlined, LinkedinOutlined, GithubOutlined, UserOutlined, ContainerOutlined, BookOutlined, ToolOutlined, DownloadOutlined

## External Links (in Resume Data)

| Type | URL | Purpose |
|------|-----|---------|
| LinkedIn | https://linkedin.com/in/baotoq | Professional profile |
| GitHub | https://github.com/baotoq | Code portfolio |
| Company | https://covergo.com | Current employer |
| Company | https://upmesh.io | Previous employer |
| Company | https://nashtech.com | Previous employer |

## Deployment Target

- **Platform**: GitHub Pages (inferred from static export + `/resume` base path)
- **Build**: Static HTML/CSS/JS files in `out/` directory
- **No server-side requirements**

