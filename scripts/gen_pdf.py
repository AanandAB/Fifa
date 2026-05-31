from fpdf import FPDF
import os

class PDF(FPDF):
    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', 0, 0, 'C')

pdf = PDF()
pdf.alias_nb_pages()
pdf.set_auto_page_break(auto=True, margin=20)
pdf.add_page()

# Title
pdf.set_font('Helvetica', 'B', 22)
pdf.set_text_color(8, 12, 24)
pdf.cell(0, 12, 'FIFA World Cup 2026', 0, 1, 'L')
pdf.set_font('Helvetica', 'B', 16)
pdf.cell(0, 10, 'Cloudflare Tunnel Setup & Monetization Guide', 0, 1, 'L')
pdf.set_draw_color(255, 215, 0)
pdf.set_line_width(0.8)
pdf.line(10, pdf.get_y()+2, 200, pdf.get_y()+2)
pdf.ln(8)
pdf.set_font('Helvetica', '', 10)
pdf.set_text_color(100, 100, 100)
pdf.cell(0, 6, 'Prepared for Aanand AB | Project: Fifa2026 | June 2026', 0, 1, 'L')
pdf.ln(6)

def section(title, size=15):
    pdf.ln(4)
    pdf.set_font('Helvetica', 'B', size)
    pdf.set_text_color(8, 12, 24)
    pdf.cell(0, 10, title, 0, 1, 'L')
    pdf.set_draw_color(67, 97, 238)
    pdf.set_line_width(0.5)
    pdf.line(10, pdf.get_y()+1, 200, pdf.get_y()+1)
    pdf.ln(6)

def body(text):
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(30, 30, 30)
    for line in text.split('\n'):
        pdf.cell(0, 5.5, line, 0, 1, 'L')
    pdf.ln(2)

def code_block(text):
    pdf.set_fill_color(245, 245, 245)
    pdf.set_draw_color(67, 97, 238)
    pdf.set_font('Courier', '', 8)
    pdf.set_text_color(40, 40, 40)
    lines = text.split('\n')
    block_h = len(lines) * 4.5 + 10
    if pdf.get_y() + block_h > 270:
        pdf.add_page()
    pdf.rect(14, pdf.get_y(), 182, block_h, 'D')
    pdf.set_xy(16, pdf.get_y() + 5)
    for line in lines:
        pdf.cell(0, 4.5, line, 0, 1, 'L')
    pdf.ln(5)

def table(headers, rows):
    col_w = 190 / len(headers)
    pdf.set_fill_color(8, 12, 24)
    pdf.set_text_color(255, 215, 0)
    pdf.set_font('Helvetica', 'B', 8)
    for h in headers:
        pdf.cell(col_w, 7, h, 1, 0, 'C', True)
    pdf.ln()
    pdf.set_text_color(30, 30, 30)
    pdf.set_font('Helvetica', '', 9)
    fill = False
    for row in rows:
        if pdf.get_y() > 260:
            pdf.add_page()
            pdf.set_fill_color(8, 12, 24)
            pdf.set_text_color(255, 215, 0)
            pdf.set_font('Helvetica', 'B', 8)
            for h in headers:
                pdf.cell(col_w, 7, h, 1, 0, 'C', True)
            pdf.ln()
            pdf.set_text_color(30, 30, 30)
            pdf.set_font('Helvetica', '', 9)
        if fill:
            pdf.set_fill_color(248, 248, 248)
        else:
            pdf.set_fill_color(255, 255, 255)
        for cell in row:
            pdf.cell(col_w, 6, str(cell), 1, 0, 'C', True)
        pdf.ln()
        fill = not fill
    pdf.ln(4)

def box(text, color='blue'):
    c = (240, 244, 255) if color == 'blue' else (232, 245, 233) if color == 'green' else (255, 248, 225)
    border = (67, 97, 238) if color == 'blue' else (46, 204, 113) if color == 'green' else (255, 215, 0)
    pdf.set_fill_color(*c)
    pdf.set_draw_color(*border)
    pdf.set_font('Helvetica', '', 9)
    pdf.set_text_color(30, 30, 30)
    lines = text.split('\n')
    box_h = len(lines) * 5.5 + 12
    if pdf.get_y() + box_h > 270:
        pdf.add_page()
    pdf.rect(14, pdf.get_y(), 182, box_h, 'DF')
    pdf.set_xy(18, pdf.get_y() + 6)
    for line in lines:
        pdf.cell(0, 5.5, line, 0, 1, 'L')
    pdf.ln(8)

# ═══════════════════════════ CONTENT ═══════════════════════════

section('1. Architecture Overview')
body('India viewers -> Cloudflare Edge (Mumbai/Chennai/Delhi) -> Cloudflare Tunnel -> US Machine -> OTA capture -> ffmpeg HLS on :8080')

section('2. Phase-by-Phase Setup')

section('Phase 1: Domain & DNS (5 min)', 12)
body('1. Buy domain from Namecheap, Porkbun, or Cloudflare Registrar\n2. Sign up at cloudflare.com (free tier)\n3. Add domain -> change nameservers to Cloudflare\n4. DNS: Add CNAME record watch -> @ with Proxy ON (orange cloud)')

section('Phase 2: US Stream Capture', 12)
body('Option A - Software Only (Free):')
code_block('pip install streamlink\nstreamlink https://foxsports.com/live best -O | \\\n  ffmpeg -i pipe:0 -c:v libx264 -preset veryfast \\\n  -b:v 1500k -c:a aac -b:a 128k \\\n  -f hls stream.m3u8\npython3 -m http.server 8080')

body('Option B - OTA Hardware ($120 one-time):')
body('HDHomeRun Flex Duo (~$100) + Indoor Antenna (~$20)')
code_block('# Find Fox channel (usually 5.1 or 11.1)\nhdhomerun_config discover\n\nffmpeg -i http://192.168.1.x:5004/auto/v5.1 \\\n  -c:v libx264 -preset veryfast -b:v 1500k \\\n  -s 1280x720 -c:a aac -b:a 128k \\\n  -f hls stream.m3u8\npython3 -m http.server 8080')

section('Phase 3: Cloudflare Tunnel', 12)
code_block('# Install (Windows)\nwinget install Cloudflare.cloudflared\n\n# Authenticate\ncloudflared tunnel login\n\n# Create tunnel\ncloudflared tunnel create fifa2026-stream\n\n# Route your domain\ncloudflared tunnel route dns fifa2026-stream \\\n  watch.yourdomain.com\n\n# Run as Windows service (auto-start)\ncloudflared service install')

body('config.yml (save to C:\\Users\\<user>\\.cloudflared\\):')
code_block('tunnel: <TUNNEL_ID>\ncredentials-file: C:\\Users\\...\\.cloudflared\\<ID>.json\ningress:\n  - hostname: watch.yourdomain.com\n    service: http://localhost:8080\n  - service: http_status:404')

section('Phase 4: Website + Go Live', 12)
body('Update video src to: https://watch.yourdomain.com/stream.m3u8\nDeploy site to Netlify/Vercel with custom domain')
body('Checklist:\n[ ] Antenna + tuner OR streamlink access to Fox\n[ ] ffmpeg captures OTA and serves HLS on :8080\n[ ] cloudflared installed and tunnel created\n[ ] Subdomain routed: watch.yourdomain.com -> tunnel\n[ ] cloudflared running as Windows service\n[ ] Test: open watch.yourdomain.com -> see stream\n[ ] Update website player URL -> deploy')

section('3. Cloudflare vs Tailscale')

table(
    ['Factor', 'Tailscale Funnel', 'Cloudflare Tunnel'],
    [['India edge servers', 'No (relayed SG/JP)', 'Yes - 5 locations'],
     ['Latency to India', '300-500ms', '180-250ms'],
     ['Concurrent viewers', '1-5', '50-100+'],
     ['Custom domain', 'tailnet.ts.net', 'watch.yourdomain.in'],
     ['DDoS protection', 'None', 'Built-in free'],
     ['Cost', 'Free', 'Free']]
)
box('WINNER: Cloudflare Tunnel - India edge servers + direct fiber backbone + custom domain + DDoS. All free.', 'green')

section('4. Monetization Strategy')
body('India: 1.4B population. 2022 World Cup: ~85M Indian viewers despite 2AM kickoffs. Football viewership exploding in India.')

section('Tier 1: Day-1 Revenue', 12)
body('A. Google AdSense (sign up: adsense.google.com)')
table(
    ['Placement', 'RPM (India)', 'Monthly @ 10K/day'],
    [['Banner (728x90)', '$0.50 - 1.50', '$150 - 450'],
     ['Sidebar (300x250)', '$0.80 - 2.00', '$240 - 600'],
     ['In-content', '$1.00 - 3.00', '$300 - 900'],
     ['VIDEO PRE-ROLL', '$2.00 - 5.00', '$600 - 1,500'],
     ['ESTIMATED TOTAL', '', '$1,200 - 3,450/mo']]
)

body('B. Affiliate Links')
table(
    ['Partner', 'Commission', 'Pitch'],
    [['Amazon (football)', '4-8%', 'Official 2026 jersey'],
     ['Dream11 / MPL', 'Rs 50-100/signup', 'Build fantasy XI'],
     ['FanCode Shop', '10-15%', 'India sports merch'],
     ['ExpressVPN', '$15-30/signup', 'Watch from anywhere'],
     ['Hostinger', '$50-100/sale', 'Host your own site']]
)

body('C. Donations: UPI QR code (zero fees, instant in India) + Buy Me a Coffee / Ko-fi')

section('Tier 2: Premium Features (Week 2)', 12)
table(
    ['Feature', 'Price', 'Revenue Model'],
    [['Bracket competition', '$2.99 entry', '50% prize, 50% you'],
     ['Ad-free experience', '$4.99/mo', '100% margin'],
     ['SMS goal alerts', '$1.99/mo', 'Twilio $0.0075/SMS'],
     ['AI predictions', '$3.99/mo', 'Premium access']]
)
box('Example: 500 people x $2.99 = $1,495 total. $750 to winner, $745 profit for you.', 'blue')

section('Tier 3: Scaling (Week 3-4)', 12)
table(
    ['Revenue Stream', 'Difficulty', 'Peak Month Potential'],
    [['Programmatic ads', 'Easy', '$1K - 5K'],
     ['Direct ad sales (Indian brands)', 'Medium', '$5K - 25K'],
     ['Affiliate links', 'Easy', '$500 - 3K'],
     ['Premium subscriptions', 'Medium', '$1K - 10K'],
     ['Sponsored match previews', 'Medium', '$500 - 2K/post'],
     ['White-label (sports bars)', 'Hard', '$2K - 10K']]
)

section('Traffic & Revenue Projection (India)')
table(
    ['Tournament Phase', 'Daily Visitors', 'Monthly Revenue'],
    [['Pre-tournament', '500 - 2K', '$200 - 800'],
     ['Group Stage', '5K - 20K', '$2,000 - 8,000'],
     ['Knockouts', '20K - 50K', '$8,000 - 20,000'],
     ['FINAL WEEK', '50K - 100K+', '$20,000 - 50,000']]
)

section('5. SEO Strategy')
body('Target Keywords (India):\n- "FIFA World Cup 2026 live stream free"\n- "Watch World Cup online India free"\n- "World Cup 2026 match schedule IST"\n- "World Cup 2026 points table"\n\nPages to create: /live, /schedule, /points-table, /how-to-watch\n\nAlready done: meta tags, OG tags, semantic HTML, mobile responsive, PWA manifest\n\nAdd: sitemap.xml, robots.txt, Schema.org SportsEvent structured data')

section('6. Legal Note')
box('This routes YOUR personal free OTA broadcast through YOUR own infrastructure.\nSimilar to a Slingbox or personal DVR streaming.\nDo not publicly market as "free streaming service".\nConsult a lawyer if you plan to scale significantly.', 'yellow')

section('7. Quick Reference')
table(
    ['What', 'URL / Command'],
    [['Cloudflare signup', 'cloudflare.com'],
     ['Install cloudflared', 'winget install Cloudflare.cloudflared'],
     ['Create tunnel', 'cloudflared tunnel create fifa2026-stream'],
     ['Route domain', 'cloudflared tunnel route dns ... watch.domain.com'],
     ['Install as service', 'cloudflared service install'],
     ['Stream server', 'python3 -m http.server 8080'],
     ['Website repo', 'github.com/AanandAB/Fifa'],
     ['Google AdSense', 'adsense.google.com']]
)

section('8. Next Steps')
body('1. Buy domain (Namecheap/Porkbun/Cloudflare)\n2. Set up Cloudflare DNS\n3. US machine: antenna + tuner + ffmpeg\n4. Install cloudflared, create tunnel, route domain\n5. Update website stream URL\n6. Deploy site to Netlify/Vercel\n7. Monetize: AdSense + UPI + affiliate links')

# Save PDF
output_path = r'C:\Users\aanan\Desktop\AANAND AB\PROJECTS\Fifa2026\docs\FIFA2026-Cloudflare-Monetization-Guide.pdf'
os.makedirs(os.path.dirname(output_path), exist_ok=True)
pdf.output(output_path)
print(f'PDF saved: {output_path}')
print(f'Total pages: {pdf.page_no()}')
print(f'File size: {os.path.getsize(output_path)} bytes')
