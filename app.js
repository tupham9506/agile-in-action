
function switchScreen(showId, hideIds){
  (hideIds || []).forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.classList.add('hidden');
  });
  const el = document.getElementById(showId);
  if(!el) return;
  el.classList.remove('hidden');
  if(window.gsap){
    gsap.fromTo(el, {opacity:0, y:18}, {opacity:1, y:0, duration:0.55, ease:'power2.out'});
  }
}

function person(x, groundY, color, opts){
  opts = opts || {};
  const headR = 16;
  const bodyH = 56;
  const bodyTop = groundY - bodyH - headR*2 + 4;
  const headCy = bodyTop - headR + 2;
  let arms = '';
  if(opts.pose === 'up'){
    arms = `<line x1="${x-14}" y1="${bodyTop+14}" x2="${x-26}" y2="${bodyTop-10}" stroke="${color}" stroke-width="7" stroke-linecap="round"/>
            <line x1="${x+14}" y1="${bodyTop+14}" x2="${x+26}" y2="${bodyTop-10}" stroke="${color}" stroke-width="7" stroke-linecap="round"/>`;
  } else if(opts.pose === 'point'){
    const dir = opts.facing === 'left' ? -1 : 1;
    arms = `<line x1="${x-dir*14}" y1="${bodyTop+18}" x2="${x-dir*28}" y2="${bodyTop+32}" stroke="${color}" stroke-width="7" stroke-linecap="round"/>
            <line${opts.id ? ` id="${opts.id}-jab"` : ''} x1="${x+dir*14}" y1="${bodyTop+18}" x2="${x+dir*32}" y2="${bodyTop+4}" stroke="${color}" stroke-width="7" stroke-linecap="round"/>`;
  } else {
    arms = `<line x1="${x-14}" y1="${bodyTop+18}" x2="${x-23}" y2="${bodyTop+42}" stroke="${color}" stroke-width="7" stroke-linecap="round"/>
            <line x1="${x+14}" y1="${bodyTop+18}" x2="${x+23}" y2="${bodyTop+42}" stroke="${color}" stroke-width="7" stroke-linecap="round"/>`;
  }
  let extra = '';
  if(opts.bubble){
    const bx = x + (opts.bubbleSide === 'left' ? -80 : 28);
    extra += `<rect x="${bx}" y="${headCy-52}" width="58" height="38" rx="12" fill="var(--bg-elev)" stroke="${color}" stroke-width="2.5"/>
      <circle cx="${bx+17}" cy="${headCy-33}" r="2.8" fill="${color}"/>
      <circle cx="${bx+29}" cy="${headCy-33}" r="2.8" fill="${color}"/>
      <circle cx="${bx+41}" cy="${headCy-33}" r="2.8" fill="${color}"/>`;
  }
  if(opts.alert){
    extra += `<circle cx="${x+23}" cy="${headCy-24}" r="15" fill="var(--bad)"/>
      <text x="${x+23}" y="${headCy-18}" font-size="20" font-weight="700" fill="#fff" text-anchor="middle">!</text>`;
  }
  return `<g${opts.id ? ` id="${opts.id}"` : ''}>
    ${arms}
    <rect x="${x-16}" y="${bodyTop}" width="32" height="${bodyH}" rx="14" fill="${color}"/>
    <circle cx="${x}" cy="${headCy}" r="${headR}" fill="${color}"/>
    ${extra}
  </g>`;
}

function buildScene(type){
  const g = 150;
  const c1 = 'var(--accent)', c2 = 'var(--ink-dim)', c3 = 'var(--brick)', c4 = 'var(--good)';
  let body = '';
  switch(type){
    case 'customer':
      body = person(60,g,c1,{pose:'point', id:'walkerCustomer'}) + person(150,g,c2,{pose:'normal'});
      break;
    case 'charter':
      body = `<rect x="90" y="60" width="60" height="6" fill="var(--line)"/>` +
             person(60,g,c1,{pose:'normal'}) + person(120,g,c2,{pose:'point'}) + person(180,g,c4,{pose:'normal'});
      break;
    case 'meeting':
      body = person(80,g,c2,{pose:'point', bubble:true, bubbleSide:'right'}) + person(160,g,c1,{pose:'normal'});
      break;
    case 'solo':
      body = `<rect x="150" y="40" width="40" height="30" rx="4" fill="none" stroke="var(--line)" stroke-width="2"/>
        <line x1="156" y1="50" x2="184" y2="50" stroke="var(--line)" stroke-width="2"/>
        <line x1="156" y1="58" x2="178" y2="58" stroke="var(--line)" stroke-width="2"/>` +
        person(90,g,c1,{pose:'point'});
      break;
    case 'planning':
      body = `<rect x="95" y="35" width="70" height="46" rx="4" fill="none" stroke="var(--line)" stroke-width="2"/>
        <line x1="118" y1="35" x2="118" y2="81" stroke="var(--line)" stroke-width="1.5"/>
        <line x1="142" y1="35" x2="142" y2="81" stroke="var(--line)" stroke-width="1.5"/>` +
        person(45,g,c1,{pose:'point'}) + person(215,g,c4,{pose:'normal'});
      break;
    case 'standup': {
      const xs = [55,105,155,205];
      const cols = [c1,c2,c4,c3];
      xs.forEach((x,i)=>{ body += person(x,g,cols[i%cols.length],{pose:i===1?'point':'normal'}); });
      break;
    }
    case 'alert':
      body = person(130,g,c3,{pose:'point', alert:true});
      break;
    case 'review':
      body = `<rect x="150" y="30" width="46" height="32" rx="3" fill="none" stroke="var(--line)" stroke-width="2"/>
        <line x1="158" y1="42" x2="188" y2="42" stroke="var(--line)" stroke-width="1.5"/>
        <line x1="158" y1="50" x2="182" y2="50" stroke="var(--line)" stroke-width="1.5"/>` +
        person(45,g,c1,{pose:'point'}) + person(90,g,c2,{pose:'normal'}) + person(220,g,c4,{pose:'normal'});
      break;
    case 'retro': {
      const cx=130, cy=55, r=42;
      const cols = [c1,c2,c4,c3];
      for(let i=0;i<4;i++){
        const a = (Math.PI*2/4)*i - Math.PI/2;
        const x = cx + r*Math.cos(a);
        body += person(x, g, cols[i], {pose:'normal'});
      }
      body += `<circle cx="${cx}" cy="${g-20}" r="14" fill="none" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="3 3"/>`;
      break;
    }
    case 'release': {
      const xs=[55,105,155,205];
      const cols=[c1,c4,c2,c3];
      xs.forEach((x,i)=>{ body += person(x,g,cols[i],{pose:'up'}); });
      body += `<circle cx="60" cy="20" r="2.5" fill="var(--accent)"/><circle cx="130" cy="14" r="2.5" fill="var(--good)"/><circle cx="200" cy="22" r="2.5" fill="var(--brick)"/><circle cx="95" cy="24" r="2" fill="var(--accent)"/><circle cx="165" cy="18" r="2" fill="var(--good)"/>`;
      break;
    }
    default:
      body = person(130,g,c1,{pose:'normal'});
  }
  return `<svg viewBox="0 0 300 180"><line x1="10" y1="${g}" x2="290" y2="${g}" stroke="var(--line)" stroke-width="1.5"/>${body}</svg>`;
}

const days = [
  {
    day: 1,
    phase: "SPRINT 0 · CHUẨN BỊ",
    title: "Khách hàng đến và đưa yêu cầu",
    scene: "customer",
    quote: "Tôi muốn quản lý số dư tiền ảo.",
    decision: {
      principleTag: "Nguyên tắc 1: Thỏa mãn khách hàng là ưu tiên hàng đầu",
      question: "Khi nhận được yêu cầu còn mơ hồ như thế này, đội nên phản ứng thế nào?",
      options: [
        { label: "Ghi nhận, coi đây là điểm khởi đầu bình thường — sẽ làm rõ dần qua từng Sprint", type: "good", delta: 8,
          outcome: "Đúng tinh thần Agile: không cần biết hết ngay từ đầu, chỉ cần đủ rõ để bắt đầu Sprint đầu tiên, phần còn lại làm rõ dần qua hợp tác với khách hàng." },
        { label: "Yêu cầu khách hàng viết đặc tả chi tiết, đầy đủ trước khi đội bắt tay vào việc", type: "rigid", delta: -8,
          outcome: "Tư duy kiểu Waterfall: cố đặc tả hết mọi thứ ngay từ đầu — khiến dự án chưa bắt đầu đã chậm trễ, trong khi thực tế yêu cầu vẫn sẽ đổi." },
        { label: "Tự đoán chi tiết theo ý mình, không hỏi lại khách hàng", type: "anti", delta: -10,
          outcome: "Bỏ qua hợp tác với khách hàng — dễ làm sai trọng tâm ngay từ những bước đầu tiên." }
      ]
    }
  },
  {
    day: 2,
    phase: "SPRINT 0 · CHUẨN BỊ",
    title: "Kickoff & Project Charter",
    scene: "charter",
    body: `
      <ul>
        <li><b>Mục tiêu:</b> đăng nhập, đăng xuất, quên mật khẩu, số dư ảo.</li>
        <li><b>Ràng buộc:</b> ~3 tuần, 5 người (PO, SM, 2 Dev, QA).</li>
      </ul>`,
  },
  {
    day: 3,
    phase: "SPRINT 1 · LẬP KẾ HOẠCH",
    title: "Sprint Planning #1",
    scene: "planning",
    body: `
      <p>Product Backlog đã sẵn sàng (Đăng nhập, Đăng xuất, Khôi phục mật khẩu, Xem số dư ảo...). Cả team chọn việc cho Sprint 1.</p>
      <p><button class="flask-btn" onclick="toggleSprintGoal(this)">Hiện Sprint Goal</button> <span class="hidden"><b>Sprint Goal:</b> đăng nhập & đăng xuất an toàn.</span></p>
      <div class="kanban">
        <div class="kcol"><h4>Cần làm</h4>
          <div class="kcard">Form đăng nhập</div>
          <div class="kcard">API xác thực</div>
          <div class="kcard">Đăng xuất</div>
        </div>
        <div class="kcol"><h4>Đang làm</h4></div>
        <div class="kcol"><h4>Xong</h4></div>
      </div>
      <p>Chưa nhận thêm việc khác vào Sprint này.</p>`,
  },
  {
    day: 4,
    phase: "SPRINT 1 · THỰC THI",
    title: "Sprint 1 diễn ra",
    scene: "standup",
    body: `
      <ul>
        <li>Team dựng xong form đăng nhập, API xác thực hoạt động, bắt đầu code đăng xuất.</li>
        <li><b>⚠️ Sự kiện:</b> QA phát hiện mật khẩu chưa hash, chưa HTTPS — còn 3 ngày là Sprint Review.</li>
      </ul>`,
    reveal: ["mock-login", "mock-loginbtn", "mock-logout"],
    decision: {
      principleTag: "Nguyên tắc 9: Chú trọng kỹ thuật xuất sắc và thiết kế tốt",
      question: "Xử lý lỗ hổng bảo mật này ra sao?",
      options: [
        { label: "Vá ngay (hash mật khẩu, bắt buộc HTTPS), dời việc khác lại", type: "good", delta: 8,
          outcome: "Bảo mật không thể chờ Sprint sau. Phát hiện sớm nên chi phí sửa còn thấp." },
        { label: "Bỏ qua, cứ demo bản hiện tại cho đúng tiến độ", type: "rigid", delta: -12,
          outcome: "Giữ tiến độ bằng mọi giá dù biết rủi ro — nguy hiểm thật cho tài khoản người dùng." },
        { label: "Dừng cả Sprint, viết lại tài liệu thiết kế bảo mật từ đầu", type: "anti", delta: -6,
          outcome: "Thái quá — chỉ cần vá đúng chỗ hổng, không cần dừng cả Sprint để viết lại tài liệu." }
      ]
    }
  },
  {
    day: 5,
    phase: "SPRINT 1 · REVIEW",
    title: "Sprint Review #1",
    scene: "review",
    body: `<p>Demo đăng nhập/đăng xuất thật cho PO. PO hài lòng, đề xuất "ghi nhớ đăng nhập" — đưa vào Backlog, không chèn gấp.</p>`,
  },
  {
    day: 6,
    phase: "SPRINT 1 · RETROSPECTIVE",
    title: "Retrospective #1",
    scene: "retro",
    body: `
      <details class="retro-toggle">
        <summary>Xem nội dung Retro</summary>
        <ul>
          <li><b>Tốt:</b> Standup + QA sớm giúp vá lỗ hổng kịp thời.</li>
          <li><b>Cần cải thiện:</b> nên test bảo mật từ đầu Sprint.</li>
          <li><b>Hành động:</b> Sprint 2 test bảo mật ngay sau khi code phần nhạy cảm.</li>
        </ul>
      </details>`,
  },
  {
    day: 7,
    phase: "SPRINT 2 · LẬP KẾ HOẠCH",
    title: "Sprint Planning #2",
    scene: "planning",
    body: `
      <p><button class="flask-btn" onclick="toggleSprintGoal(this)">Hiện Sprint Goal</button> <span class="hidden"><b>Sprint Goal:</b> khôi phục mật khẩu + thấy số dư sau đăng nhập.</span></p>
      <div class="kanban">
        <div class="kcol"><h4>Cần làm</h4>
          <div class="kcard">Form quên mật khẩu</div>
          <div class="kcard">Trang dashboard</div>
          <div class="kcard">Hiển thị số dư</div>
        </div>
        <div class="kcol"><h4>Đang làm</h4></div>
        <div class="kcol"><h4>Xong</h4></div>
      </div>`,
  },
  {
    day: 8,
    phase: "SPRINT 2 · THỰC THI",
    title: "Sprint 2 diễn ra",
    scene: "standup",
    body: `
      <ul>
        <li>Team dựng khung dashboard, code form quên mật khẩu (nhập email → gửi link reset) — dashboard xong, đăng nhập thấy số dư ngay, QA test lại toàn bộ luồng không phát hiện lỗi.</li>
        <li><b>⚠️ Sự kiện:</b> PO muốn thêm biểu đồ xu hướng thay vì chỉ hiện một con số, trong khi team đang code dở phần số dư dạng số.</li>
      </ul>`,
    reveal: ["mock-dashboard", "mock-forgot", "mock-balance"],
    decision: {
      principleTag: "Nguyên tắc 2: Chào đón thay đổi yêu cầu, kể cả giai đoạn muộn",
      question: "Phản ứng thế nào với yêu cầu đổi ý của PO giữa Sprint?",
      options: [
        { label: "Hoàn thành số dư dạng số (gần xong), đưa biểu đồ vào Backlog Sprint sau", type: "good", delta: 8,
          outcome: "Ghi nhận đúng mong muốn của PO mà không đảo lộn Sprint gần xong." },
        { label: "Từ chối thẳng, Sprint đã lên kế hoạch không đổi", type: "rigid", delta: -10,
          outcome: "Cứng nhắc — đi ngược tinh thần hợp tác với khách hàng." },
        { label: "Dừng ngay, chuyển toàn bộ sang làm biểu đồ", type: "anti", delta: -14,
          outcome: "Mất kiểm soát phạm vi — lãng phí công đã bỏ ra, mất mục tiêu Sprint." }
      ]
    }
  },
  {
    day: 9,
    phase: "SPRINT 2 · REVIEW",
    title: "Sprint Review #2",
    scene: "review",
    body: `<p>Demo toàn bộ: đăng nhập → xem số dư → đăng xuất → quên mật khẩu → reset → đăng nhập lại. PO chấp nhận, đưa "biểu đồ số dư" vào Backlog tương lai.</p>`,
  },
  {
    day: 10,
    phase: "SPRINT 2 · RETROSPECTIVE",
    title: "Retrospective #2",
    scene: "retro",
    body: `
      <details class="retro-toggle">
        <summary>Xem nội dung Retro</summary>
        <ul>
          <li><b>Tốt:</b> xử lý thay đổi của PO gọn — không hoảng loạn, không từ chối cứng.</li>
          <li><b>Cần cải thiện:</b> trao đổi UI sớm hơn với PO trước khi code.</li>
          <li><b>Hành động:</b> thêm bước wireframe, duyệt cùng PO trước khi code.</li>
        </ul>
      </details>`,
  },
  {
    day: 11,
    phase: "PHÁT HÀNH",
    title: "Release — Hệ thống sẵn sàng",
    scene: "release",
    body: `<p>Sau 2 Sprint (~3 tuần): đăng nhập, đăng xuất, quên mật khẩu, số dư ảo — hoàn chỉnh. Mọi vấn đề phát sinh giữa chừng đều được xử lý ngay, không dồn lại cuối dự án.</p>`,
  }
];

let current = 0;
let trust = 80;
let logs = [];

const progressEl = document.getElementById('progress');
function renderProgress(){
  progressEl.innerHTML = '';
  days.forEach((d,i)=>{
    const el = document.createElement('div');
    el.className = 'step' + (i < current ? ' done' : (i===current ? ' current':''));
    progressEl.appendChild(el);
  });
}

function flipCard(el){
  el.classList.toggle('flipped');
}

const principleDetails = {
  'Thỏa mãn khách hàng là ưu tiên hàng đầu': 'Giao hàng sớm và liên tục các sản phẩm/phần mềm có giá trị để mang lại sự hài lòng tối đa cho khách hàng.',
  'Chào đón sự thay đổi': 'Sẵn sàng thay đổi yêu cầu, ngay cả ở giai đoạn muộn của dự án. Quy trình Agile biến sự thay đổi thành lợi thế cạnh tranh cho khách hàng.',
  'Giao sản phẩm chạy được thường xuyên': 'Chuyển giao sản phẩm hoạt động tốt tới tay người dùng trong thời gian ngắn (từ vài tuần đến vài tháng), ưu tiên chu kỳ thời gian ngắn hơn.',
  'Hợp tác mỗi ngày': 'Khối kinh doanh/vận hành và đội ngũ phát triển phải làm việc cùng nhau hàng ngày trong suốt dự án.',
  'Xây dựng dự án xung quanh các cá nhân có động lực': 'Tạo môi trường làm việc tích cực, cung cấp sự hỗ trợ cần thiết và đặt niềm tin vào nhóm để họ hoàn thành công việc.',
  'Giao tiếp trực tiếp là hiệu quả nhất': 'Phương pháp truyền đạt thông tin hiệu quả và tin cậy nhất trong nội bộ nhóm là trò chuyện trực tiếp (face-to-face).',
  'Sản phẩm chạy tốt là thước đo tiến độ': 'Mức độ hoàn thành và giá trị thực tế của sản phẩm hoạt động được là thước đo chính xác nhất cho tiến độ dự án.',
  'Phát triển bền vững': 'Các quy trình Agile thúc đẩy sự phát triển bền vững. Nhà đầu tư, nhà phát triển và người dùng cần duy trì được nhịp độ làm việc ổn định lâu dài.',
  'Liên tục chú ý đến kỹ thuật xuất sắc': 'Mối quan tâm thường xuyên đến kỹ thuật chất lượng cao và thiết kế tốt sẽ làm gia tăng tính linh hoạt (agility) của dự án.',
  'Sự đơn giản là tối quan trọng': 'Nghệ thuật tối đa hóa lượng công việc chưa làm (loại bỏ các tính năng hoặc quy trình thừa) là yếu tố cốt lõi.',
  'Nhóm tự tổ chức (self-organizing teams)': 'Những kiến trúc, yêu cầu và thiết kế tốt nhất thường xuất phát từ các phân nhóm có khả năng tự quản lý và tổ chức.',
  'Tự phản hồi và cải tiến liên tục': 'Theo chu kỳ định kỳ (như sau mỗi Sprint), nhóm sẽ nhìn nhận lại cách làm việc, đánh giá hiệu quả và điều chỉnh hành vi sao cho tối ưu hơn.',
};

const pairPrinciples = {
  1: { icon: 'users', title: 'Con người & tương tác', over: 'Quy trình & công cụ',
    why: 'Các công ty từng tin rằng chỉ cần mua công cụ đắt tiền và vẽ ra quy trình (ISO, CMMI) thật dày là đủ, nhưng kết quả là con người biến thành cỗ máy, đùn đẩy trách nhiệm cho nhau kiểu "tao làm đúng quy trình rồi, lỗi tại bên mày". Phần mềm là sản phẩm trí tuệ sáng tạo, không phải sản xuất đinh ốc trên dây chuyền — không công cụ hay quy trình nào cứu được một team không biết nói chuyện với nhau; con người giao tiếp tốt sẽ tự tìm ra cách dùng công cụ đúng.',
    risk: 'Nhưng bỏ hẳn quy trình & công cụ thì rơi vào "bẫy truyền miệng": mọi thứ chỉ trao đổi qua nói miệng/chat trôi tin nhắn, không ai nhớ ai nhận task nào, code đè lên nhau làm sập hệ thống, người mới vào team hoàn toàn mù thông tin.',
    boomLeft: 'Chỉ có Con người & tương tác (Bỏ Quy trình & công cụ) → Rơi vào "bẫy truyền miệng": không ai nhớ ai nhận việc gì, code đè lên nhau, người mới vào team mù thông tin.',
    items: [
    'Xây dựng dự án xung quanh các cá nhân có động lực',
    'Giao tiếp trực tiếp là hiệu quả nhất',
    'Phát triển bền vững',
    'Nhóm tự tổ chức (self-organizing teams)',
  ]},
  2: { icon: 'package-check', title: 'Sản phẩm chạy tốt', over: 'Tài liệu đồ sộ',
    why: 'Đội ngũ từng mất 3-6 tháng chỉ để viết hàng ngàn trang tài liệu spec, sơ đồ, kiến trúc trước khi gõ dòng code đầu tiên — đến khi xong thì tài liệu đã lỗi thời còn sản phẩm thực tế đầy lỗi. Khách hàng không mua tài liệu, họ trả tiền để dùng phần mềm: báo cáo dài 500 trang bảo "tiến độ 80%" là một sự lừa dối, chỉ có tính năng bấm vào chạy được thật mới là bằng chứng dự án đang sống.',
    risk: 'Nhưng bỏ hẳn tài liệu thì thành "đống rác kỹ thuật": chỉ người viết code mới hiểu nó chạy thế nào, người đó nghỉ việc là cả hệ thống đóng băng — thậm chí 6 tháng sau chính họ quay lại cũng không hiểu nổi code của mình.',
    boomLeft: 'Chỉ có Sản phẩm chạy tốt (Bỏ Tài liệu) → Trở thành "đống rác kỹ thuật" (technical debt).',
    items: [
    'Giao sản phẩm chạy được thường xuyên',
    'Sản phẩm chạy tốt là thước đo tiến độ',
    'Liên tục chú ý đến kỹ thuật xuất sắc',
    'Sự đơn giản là tối quan trọng',
  ]},
  3: { icon: 'handshake', title: 'Hợp tác với khách hàng', over: 'Đàm phán hợp đồng',
    why: 'Hai bên từng ký hợp đồng cứng nhắc: khi sản phẩm không đúng ý, khách hàng nói "không đúng ý tôi", đội ngũ giơ hợp đồng ra cãi "ghi thế nào tôi làm đúng thế, muốn sửa thì thêm tiền" — hai bên biến thành kẻ thù, kiện tụng hoặc làm ra sản phẩm không ai dùng. Thực tế, lúc mới bắt đầu dự án, chính khách hàng cũng chưa biết chính xác họ muốn gì cho đến khi được dùng thử — hợp tác liên tục giúp hai bên cùng một thuyền, tìm giải pháp tốt nhất thay vì đứng ở hai chiến tuyến soi mói hợp đồng.',
    risk: 'Nhưng bỏ hẳn hợp đồng thì "vỡ trận" phạm vi & ngân sách: khách hàng liên tục đòi thêm vì thấy đội dễ tính, dự án phình to vô tận, đến cuối cùng ngân sách cạn mà việc chưa xong — tình cảm hợp tác cũng tan vỡ theo.',
    boomLeft: 'Chỉ có Hợp tác với khách hàng (Bỏ Đàm phán hợp đồng) → Vỡ trận phạm vi & ngân sách (scope creep).',
    items: [
    'Thỏa mãn khách hàng là ưu tiên hàng đầu',
    'Hợp tác mỗi ngày',
  ]},
  4: { icon: 'refresh-cw', title: 'Thích ứng thay đổi', over: 'Bám kế hoạch cứng nhắc',
    why: 'Từng có kiểu lập kế hoạch chi tiết cho 2 năm tới rồi coi đó là "thánh kinh" — khi thị trường đổi, đối thủ ra tính năng mới, công nghệ mới xuất hiện, team vẫn cắm đầu làm theo kế hoạch cũ vì "lỡ lên plan rồi". Thế giới công nghệ biến động từng ngày, một kế hoạch 2 năm sẽ lạc hậu chỉ sau 3 tháng — không phải cá lớn nuốt cá bé, mà là cá nhanh nuốt cá chậm, khả năng đổi hướng nhanh quyết định sự sống còn.',
    risk: 'Nhưng bỏ hẳn kế hoạch thì mất phương hướng: đổi hướng liên tục "vì Agile mà", team kiệt sức nhưng sản phẩm dậm chân tại chỗ, các bộ phận khác (Marketing, Sales...) không thể lên kế hoạch vì chẳng biết khi nào sản phẩm ra mắt.',
    boomLeft: 'Chỉ có Thích ứng thay đổi (Bỏ Kế hoạch) → Mất phương hướng (lấy cớ cho sự tùy tiện).',
    items: [
    'Chào đón sự thay đổi',
    'Tự phản hồi và cải tiến liên tục',
  ]},
};

function shuffled(arr){
  return [...arr].sort(()=> Math.random() - 0.5);
}

let labInited = false;

function initLabGame(){
  if(labInited) return;
  labInited = true;

  const vialsEl = document.getElementById('labVials');
  const grid = document.getElementById('labGrid');
  const state = {};
  let selectedVial = null;

  const pairIds = Object.keys(pairPrinciples);
  const agileEntries = shuffled(pairIds.map(pairId =>
    ({ pairId, side: 'left', label: pairPrinciples[pairId].title })
  ));
  const waterfallEntries = shuffled(pairIds.map(pairId =>
    ({ pairId, side: 'right', label: pairPrinciples[pairId].over })
  ));

  for(let i = 1; i <= 4; i++){
    state[i] = { items: [], solved: false };

    const card = document.createElement('div');
    card.className = 'flask-card';
    card.id = `flaskCard${i}`;
    card.innerHTML = `
      <div class="flask" id="flask${i}">
        <div class="flask-neck"></div>
        <div class="flask-body" id="flaskBody${i}"><div class="flask-liquid" id="flaskLiquid${i}"></div></div>
      </div>
      <div class="flask-controls">
        <button class="flask-btn mix" onclick="labMix(${i})">Pha chế</button>
      </div>
      <div class="flask-particles" id="flaskParticles${i}"></div>
    `;
    grid.appendChild(card);

    const flaskEl = card.querySelector(`#flask${i}`);
    const body = card.querySelector(`#flaskBody${i}`);
    body.addEventListener('dragover', (e)=>{ e.preventDefault(); body.classList.add('drag-over'); });
    body.addEventListener('dragleave', ()=> body.classList.remove('drag-over'));
    body.addEventListener('drop', (e)=>{
      e.preventDefault();
      body.classList.remove('drag-over');
      const dragged = e.dataTransfer.getData('text/plain');
      if(!dragged) return;
      const [dragPairId, dragSide] = dragged.split('|');
      window.labAddDrop(i, dragPairId, dragSide);
    });
    flaskEl.addEventListener('click', ()=>{
      if(!selectedVial) return;
      window.labAddDrop(i, selectedVial.pairId, selectedVial.side);
    });
  }

  function buildVialGroup(title, entries){
    const group = document.createElement('div');
    group.className = 'vial-group';
    const row = document.createElement('div');
    row.className = 'vial-row';
    group.appendChild(row);

    entries.forEach(({ pairId, side, label }) => {
      const vial = document.createElement('div');
      vial.className = `vial-card ${side === 'left' ? 'side-left' : 'side-right'}`;
      vial.onclick = ()=>{
        document.querySelectorAll('.vial-card.selected').forEach(v => v.classList.remove('selected'));
        if(selectedVial && selectedVial.pairId === pairId && selectedVial.side === side){
          selectedVial = null;
        } else {
          selectedVial = { pairId, side };
          vial.classList.add('selected');
        }
      };
      vial.innerHTML = `
        <div class="vial" draggable="true"><div class="vial-neck"></div><div class="vial-body"><div class="vial-fill"></div></div></div>
        <div class="vial-label">${label}</div>
      `;
      const icon = vial.querySelector('.vial');
      icon.addEventListener('dragstart', (e)=>{
        e.dataTransfer.setData('text/plain', `${pairId}|${side}`);
        e.dataTransfer.effectAllowed = 'copy';
      });
      row.appendChild(vial);
    });

    vialsEl.appendChild(group);
  }

  buildVialGroup('Agile', agileEntries);
  buildVialGroup('Waterfall', waterfallEntries);

  function renderFlask(i){
    const s = state[i];
    const liquid = document.getElementById(`flaskLiquid${i}`);
    liquid.style.height = Math.min(100, s.items.length * 25) + '%';
    const ordered = [...s.items].sort((a, b) => (a.side === b.side) ? 0 : (a.side === 'right' ? -1 : 1));
    liquid.innerHTML = ordered
      .map(it => `<div class="fl-${it.side}" style="flex:1 0 0"></div>`)
      .join('');
  }

  function spillAll(i){
    state[i].items = [];
    renderFlask(i);
  }

  window.labAddDrop = function(i, pairId, side){
    const s = state[i];
    if(s.solved) return;
    s.items.push({ pairId, side });
    document.querySelectorAll('.vial-card.selected').forEach(v => v.classList.remove('selected'));
    selectedVial = null;
    renderFlask(i);
  };

  window.labMix = function(i){
    const s = state[i];
    if(s.solved) return;
    const flaskEl = document.getElementById(`flask${i}`);

    const byPair = {};
    s.items.forEach(it => {
      byPair[it.pairId] = byPair[it.pairId] || { left: 0, right: 0 };
      byPair[it.pairId][it.side]++;
    });
    const pairIdsUsed = Object.keys(byPair);
    const isPure = pairIdsUsed.length === 1;
    const counts = isPure ? byPair[pairIdsUsed[0]] : null;

    if(isPure && counts.left > 0 && counts.right > 0){
      s.solved = true;
      document.getElementById(`flaskCard${i}`).classList.add('solved');
      renderFlask(i);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      return;
    }

    flaskEl.classList.add('shake', 'boom');
    setTimeout(()=> flaskEl.classList.remove('shake', 'boom'), 500);
    spawnExplosion(i);
    spillAll(i);
  };

  function spawnExplosion(i){
    const holder = document.getElementById(`flaskParticles${i}`);
    holder.innerHTML = '';
    const count = 14;
    for(let p = 0; p < count; p++){
      const dot = document.createElement('span');
      dot.className = 'boom-particle';
      const angle = (p / count) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 60 + Math.random() * 50;
      dot.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      dot.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
      dot.style.background = p % 2 === 0 ? 'var(--bad)' : 'var(--accent)';
      holder.appendChild(dot);
    }
    setTimeout(()=> { holder.innerHTML = ''; }, 700);
  }

  for(let i = 1; i <= 4; i++) renderFlask(i);
}

const historySlides = [
  { tag: '1970', scene: 'royce' },
  { tag: '1990', scene: 'waterfall' },
  { tag: '', scene: 'year' },
  { tag: '1990', scene: 'crisis1990' },
  { tag: 'Snowbird, Utah', scene: 'independentIdeas' },
  { tag: '4 Giá trị cốt lõi', scene: 'fourValues' },
  { tag: '12 Nguyên tắc', scene: 'twelvePrinciples' },
  { tag: 'Scrum · Định nghĩa', scene: 'scrumDefinition' },
  { tag: 'Scrum · Vai trò', scene: 'scrumRoles' },
  { tag: 'Scrum · Sự kiện', scene: 'scrumEvents' },
  { tag: 'Scrum · Artifact', scene: 'scrumArtifacts' },
  { tag: '3 Trụ cột', scene: 'scrumPillars' },
];

const scrumPillarsData = [
  { title: 'Minh bạch', desc: 'Mọi thông tin (tiến độ, lỗi, yêu cầu) phải công khai để ai trong team và sếp cũng nhìn thấy rõ ràng.' },
  { title: 'Kiểm tra', desc: 'Thường xuyên kiểm tra tiến độ và sản phẩm (qua Daily, Review) để phát hiện sớm bất thường.' },
  { title: 'Thích ứng', desc: 'Nếu phát hiện sai lệch hoặc thị trường đổi, team lập tức điều chỉnh kế hoạch, không khăng khăng giữ lộ trình cũ.' },
];

const scrumEventsData = [
  { title: 'Sprint', desc: 'Khung thời gian cố định (1–4 tuần) bao trùm tất cả sự kiện khác — mỗi Sprint cho ra 1 Increment.' },
  { title: 'Sprint Planning', desc: 'Đầu Sprint: cả team chọn việc từ Backlog, thống nhất Sprint Goal.' },
  { title: 'Daily Scrum', desc: 'Họp đứng 15 phút mỗi ngày, đồng bộ tiến độ và phát hiện vướng mắc sớm.' },
  { title: 'Sprint Review', desc: 'Cuối Sprint: demo sản phẩm thật cho stakeholder, thu phản hồi.' },
  { title: 'Sprint Retrospective', desc: 'Cả team nhìn lại cách làm việc, tìm cách cải tiến cho Sprint sau.' },
];

const scrumArtifactsData = [
  { title: 'Product Backlog', desc: 'Danh sách toàn bộ việc cần làm cho sản phẩm, sắp xếp theo độ ưu tiên, luôn có thể thay đổi.' },
  { title: 'Sprint Backlog', desc: 'Phần việc team chọn cho Sprint hiện tại, cộng kế hoạch để hoàn thành Sprint Goal.' },
  { title: 'Increment', desc: 'Sản phẩm chạy được, tích luỹ qua từng Sprint — luôn ở trạng thái có thể dùng được.' },
];

const twelvePrinciplesFlat = [
  { text: 'Thỏa mãn khách hàng qua sản phẩm chạy tốt.', group: 1 },
  { text: 'Đón nhận mọi thay đổi.', group: 3 },
  { text: 'Giao hàng thường xuyên để lấy phản hồi.', group: 2 },
  { text: 'Hợp tác hàng ngày giữa các bên.', group: 2 },
  { text: 'Xây dựng nhóm có động lực & tin tưởng.', group: 0 },
  { text: 'Trao đổi trực tiếp.', group: 0 },
  { text: 'Đo tiến độ bằng sản phẩm thực tế.', group: 1 },
  { text: 'Duy trì nhịp độ làm việc ổn định để ứng biến lâu dài.', group: 3 },
  { text: 'Duy trì chất lượng thiết kế & kỹ thuật.', group: 1 },
  { text: 'Giữ sự đơn giản để dễ thay đổi.', group: 3 },
  { text: 'Nhóm tự tổ chức.', group: 0 },
  { text: 'Đội ngũ cùng nhìn nhận, điều chỉnh cách làm.', group: 0 },
];
const twelvePrinciplesGroupMeta = [
  { title: 'Con người & Tương tác hơn Quy trình & Công cụ', color: 'c1' },
  { title: 'Sản phẩm chạy tốt hơn Tài liệu đầy đủ', color: 'c4' },
  { title: 'Hợp tác với Khách hàng hơn Đàm phán hợp đồng', color: 'c2' },
  { title: 'Phản ứng với Thay đổi hơn Theo đúng kế hoạch', color: 'c3' },
];

const fourValuesData = [
  {
    problemTitle: 'Vấn đề 1: Thảm hoạ "Giao tiếp qua gián tiếp"',
    problemSub: '(Bị ngợp bởi Quy trình & Công cụ)',
    title: 'Cá nhân & sự tương tác',
    over: 'Quy trình & công cụ',
  },
  {
    problemTitle: 'Vấn đề 2: Thảm hoạ "Tài liệu hoá mọi thứ"',
    problemSub: '(Bị ngợp bởi Tài liệu đồ sộ)',
    title: 'Sản phẩm chạy tốt',
    over: 'Tài liệu đồ sộ',
  },
  {
    problemTitle: 'Vấn đề 3: Thảm hoạ "Đấu đá pháp lý"',
    problemSub: '(Bị ngợp bởi Đàm phán hợp đồng)',
    title: 'Hợp tác với khách hàng',
    over: 'Đàm phán hợp đồng',
  },
  {
    problemTitle: 'Vấn đề 4: Thảm hoạ "Đóng băng kế hoạch"',
    problemSub: '(Bị ngợp bởi Bám sát kế hoạch)',
    title: 'Thích ứng với thay đổi',
    over: 'Bám sát kế hoạch',
  },
];

let historyIndex = 0;

function buildHistoryScene(type){
  const g = 150;
  const c1 = 'var(--accent)', c2 = 'var(--ink-dim)', c3 = 'var(--brick)', c4 = 'var(--good)';
  let body = '';
  if(type === 'independentIdeas'){
    const mountains = `<path d="M0,220 L110,90 L190,220 Z" fill="var(--line)" opacity="0.3"/>
      <path d="M170,220 L300,60 L410,220 Z" fill="var(--line)" opacity="0.3"/>
      <path d="M370,220 L480,100 L480,220 Z" fill="var(--line)" opacity="0.3"/>`;
    const tri = [
      { color: c1, x: 240, gy: 140, tag: 'XP' },
      { color: c4, x: 130, gy: 205, tag: 'Scrum' },
      { color: c3, x: 350, gy: 205, tag: 'Các chuyên gia độc lập' },
    ];
    const beer = (bx, by, color) => `<g transform="translate(${bx},${by})">
      <rect x="-7" y="-14" width="14" height="18" rx="2" fill="${color}" opacity="0.85"/>
      <path d="M7,-11 q8,0 8,6 q0,6 -8,6" fill="none" stroke="${color}" stroke-width="2"/>
      <rect x="-7" y="-17" width="14" height="4" rx="1" fill="var(--bg-elev)"/>
    </g>`;
    let peopleBody = '';
    let beerBody = '';
    tri.forEach((p, i)=>{
      const headTop = p.gy - 114;
      peopleBody += `<g id="beatIdea${i}" opacity="0">
        ${person(p.x, p.gy, p.color, {pose:'point', facing: p.x <= 240 ? 'right' : 'left'})}
        <text x="${p.x}" y="${headTop - 8}" font-size="12" font-weight="700" fill="${p.color}" text-anchor="middle">${p.tag}</text>
      </g>`;
      beerBody += beer(p.x + (p.x <= 240 ? 22 : -22), p.gy - 20, p.color);
    });
    const flame = (fx, fy, scale) => `<g transform="translate(${fx},${fy}) scale(${scale})">
      <path d="M0,20 C-14,10 -10,-6 0,-20 C4,-8 10,-8 8,2 C16,-2 14,8 6,12 C10,14 6,20 0,20 Z" fill="var(--bad)"/>
      <path d="M0,12 C-6,6 -4,-2 0,-10 C3,-3 6,-2 4,4 C4,8 3,12 0,12 Z" fill="var(--accent)"/>
    </g>`;
    body += `<g id="beatSparks" opacity="0">${flame(240, 180, 2.2)}</g>`;
    body += `<g id="beatChicken" transform="translate(240,120)" opacity="0">
      <ellipse cx="0" cy="0" rx="22" ry="14" fill="#C6812E"/>
      <ellipse cx="-14" cy="-4" rx="9" ry="7" fill="#C6812E"/>
      <line x1="-14" y1="10" x2="-20" y2="24" stroke="#8A5A1E" stroke-width="4" stroke-linecap="round"/>
      <line x1="10" y1="10" x2="16" y2="24" stroke="#8A5A1E" stroke-width="4" stroke-linecap="round"/>
    </g>`;
    body += `<g id="beatBeers" opacity="0">${beerBody}</g>`;

    body += `<g id="beatEnemyTarget" opacity="0">
      <text x="240" y="187" font-size="16" font-weight="800" fill="var(--bad)" text-anchor="middle">WATERFALL</text>
    </g>`;
    body += `<g id="beatEnemyCrack" opacity="0">
      <line x1="195" y1="170" x2="285" y2="198" stroke="var(--bad)" stroke-width="4" stroke-linecap="round"/>
      <line x1="285" y1="170" x2="195" y2="198" stroke="var(--bad)" stroke-width="4" stroke-linecap="round"/>
    </g>`;
    return `<svg viewBox="0 0 480 220">${mountains}${peopleBody}${body}</svg>`;
  }
  if(type === 'year'){
    const wagonAt = (x) => `<g class="beat-wagon">
        <rect x="${x}" y="60" width="34" height="34" rx="4" fill="none" stroke="var(--ink-dim)" stroke-width="2.5"/>
        <text x="${x+17}" y="82" font-size="16" font-weight="700" fill="var(--ink-dim)" text-anchor="middle">w</text>
        <circle cx="${x+8}" cy="98" r="5" fill="var(--ink-dim)"/>
        <circle cx="${x+26}" cy="98" r="5" fill="var(--ink-dim)"/>
      </g>`;
    body += `<g id="beatTrain">
      <text x="70" y="100" font-size="88" font-weight="800" fill="var(--accent)" text-anchor="middle">1</text>
      <text x="125" y="100" font-size="88" font-weight="800" fill="var(--accent)" text-anchor="middle">9</text>
      <text x="180" y="100" font-size="88" font-weight="800" fill="var(--accent)" text-anchor="middle">9</text>
      <g id="beatGlobe" transform="translate(240,75)">
        <circle cx="0" cy="0" r="28" fill="none" stroke="var(--good)" stroke-width="3"/>
        <ellipse cx="0" cy="0" rx="12" ry="28" fill="none" stroke="var(--good)" stroke-width="2"/>
        <line x1="-28" y1="0" x2="28" y2="0" stroke="var(--good)" stroke-width="2"/>
        <line x1="-24" y1="-16" x2="24" y2="-16" stroke="var(--good)" stroke-width="1.5"/>
        <line x1="-24" y1="16" x2="24" y2="16" stroke="var(--good)" stroke-width="1.5"/>
      </g>
      <rect x="236" y="38" width="8" height="18" fill="var(--ink-dim)"/>
      <g id="beatSmoke">
        <circle class="beat-puff" cx="240" cy="36" r="5" fill="var(--line)" opacity="0"/>
        <circle class="beat-puff" cx="240" cy="36" r="5" fill="var(--line)" opacity="0"/>
        <circle class="beat-puff" cx="240" cy="36" r="5" fill="var(--line)" opacity="0"/>
      </g>
      <line x1="268" y1="77" x2="305" y2="77" stroke="var(--good)" stroke-width="2" stroke-dasharray="4 3"/>
      ${wagonAt(305)}
      <line x1="339" y1="77" x2="355" y2="77" stroke="var(--ink-dim)" stroke-width="2"/>
      ${wagonAt(355)}
      <line x1="389" y1="77" x2="405" y2="77" stroke="var(--ink-dim)" stroke-width="2"/>
      ${wagonAt(405)}
    </g>`;
  } else if(type === 'royce'){
    const stages = [['Yêu cầu',190,20],['Thiết kế',230,44],['Code',270,68],['Kiểm thử',310,92],['Vận hành',350,116]];
    let diagramBody = '';
    stages.forEach(([label,x,y],i)=>{
      diagramBody += `<rect x="${x}" y="${y}" width="72" height="24" rx="4" fill="var(--bg)" stroke="var(--accent)" stroke-width="2"/>
        <text x="${x+36}" y="${y+16}" font-size="10" fill="var(--ink)" text-anchor="middle">${label}</text>`;
      if(i < stages.length-1){
        const [,nx,ny] = stages[i+1];
        diagramBody += `<line x1="${x+36}" y1="${y+24}" x2="${nx+36}" y2="${ny}" stroke="var(--accent)" stroke-width="1.5" marker-end="url(#royceArrow)"/>`;
      }
    });
    body += `<defs>
      <marker id="royceArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" fill="var(--accent)"/>
      </marker>
      <clipPath id="royceClip"><circle cx="80" cy="52" r="34"/></clipPath>
    </defs>
    <g id="beatPortrait">
      <circle cx="80" cy="52" r="35" fill="none" stroke="var(--ink)" stroke-width="2.5"/>
      <image href="royce.jpg" x="46" y="18" width="68" height="68" clip-path="url(#royceClip)" preserveAspectRatio="xMidYMid slice"/>
      <text x="80" y="124" font-size="13" font-weight="700" fill="var(--ink)" text-anchor="middle">Winston W. Royce</text>
      <text x="80" y="140" font-size="10" fill="var(--ink-dim)" text-anchor="middle">Nhà khoa học máy tính</text>
    </g>
    <g id="beatDiagram" opacity="0">${diagramBody}</g>
    <g id="beatWarning" opacity="0">
      <rect x="215" y="132" width="220" height="38" rx="8" fill="var(--bg-elev)" stroke="var(--bad)" stroke-width="1.5"/>
      <text x="325" y="147" font-size="10" font-style="italic" fill="var(--ink)" text-anchor="middle">"Cách làm nối tiếp này rất rủi ro,</text>
      <text x="325" y="161" font-size="10" font-style="italic" fill="var(--ink)" text-anchor="middle">cầm chắc thất bại." — Royce, 1970</text>
    </g>
    <g id="beatStamp" transform="translate(300,85) rotate(-14)" opacity="0">
      <rect x="-118" y="-16" width="236" height="32" rx="4" fill="none" stroke="var(--bad)" stroke-width="3"/>
      <text x="0" y="6" font-size="15" font-weight="800" fill="var(--bad)" text-anchor="middle">DoD 1985 · BẮT BUỘC ÁP DỤNG</text>
    </g>`;
  } else if(type === 'waterfall'){
    const durs = ['+2 tháng','+3 tháng','+8 tháng','+3 tháng','+1 tuần'];
    const tickX = [40, 120, 200, 280, 360];
    tickX.forEach((x,i)=>{
      body += `<line x1="${x}" y1="${g-8}" x2="${x}" y2="${g+8}" stroke="var(--line)" stroke-width="2"/>
        <text id="beatDur${i}" x="${x}" y="${g+26}" font-size="11" fill="var(--bad)" text-anchor="middle" opacity="0">${durs[i]}</text>`;
    });
    body += `<g id="beatWorker">
      ${person(40, g, c1, {id:'walkerCrisis', pose:'normal'})}
      <text id="beatWorkerText1" x="40" y="14" font-size="10.5" fill="var(--ink)" text-anchor="middle"></text>
      <text id="beatWorkerText2" x="40" y="28" font-size="10.5" fill="var(--ink)" text-anchor="middle"></text>
    </g>`;
    body += `<g id="beatCustomer">
      ${person(440, g, c3, {pose:'point', facing:'left'})}
      <text id="beatBubbleText1" x="475" y="14" font-size="10.5" fill="var(--ink)" text-anchor="end"></text>
      <text id="beatBubbleText2" x="475" y="28" font-size="10.5" fill="var(--ink)" text-anchor="end"></text>
    </g>
    <g id="beatReject" transform="translate(400,90)" opacity="0">
      <path d="M0,-22 L6,-6 L22,0 L6,6 L0,22 L-6,6 L-22,0 L-6,-6 Z" fill="var(--bad)"/>
      <text x="0" y="5" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">POW</text>
    </g>`;
  } else if(type === 'crisis1990'){
    body += `<g id="beatCrisisTitle">
      <text x="240" y="70" font-size="40" font-weight="800" fill="var(--bad)" text-anchor="middle">KHỦNG HOẢNG</text>
      <text x="240" y="95" font-size="13" fill="var(--ink-dim)" text-anchor="middle">The Software Crisis — thập niên 1990</text>
    </g>`;

    const stats = [
      [31.1, 'var(--bad)', 'Huỷ bỏ', 'hoàn toàn'],
      [52.7, 'var(--wf)', 'Trễ hạn &', 'vượt ngân sách'],
      [16.2, 'var(--good)', 'Thành', 'công'],
    ];
    let statsBody = '';
    stats.forEach(([pct, color, l1, l2], i)=>{
      const cx = 140 + i*100;
      const h = pct * 1.7;
      statsBody += `<rect x="${cx-25}" y="${150-h}" width="50" height="${h}" rx="4" fill="${color}"/>
        <text x="${cx}" y="${150-h-8}" font-size="15" font-weight="800" fill="${color}" text-anchor="middle">${pct}%</text>
        <text x="${cx}" y="166" font-size="10" fill="var(--ink-dim)" text-anchor="middle">${l1}</text>
        <text x="${cx}" y="178" font-size="10" fill="var(--ink-dim)" text-anchor="middle">${l2}</text>`;
    });
    body += `<g id="beatCrisisStats" opacity="0">${statsBody}</g>`;
  } else if(type === 'fourValues'){
    fourValuesData.forEach((v, i)=>{
      body += `<g id="beatProblem${i}" opacity="0">
        <text x="240" y="85" font-size="18" font-weight="800" fill="var(--bad)" text-anchor="middle">${v.problemTitle}</text>
        <text x="240" y="112" font-size="13" fill="var(--ink-dim)" text-anchor="middle">${v.problemSub}</text>
      </g>`;
      body += `<g id="beatSolution${i}" opacity="0">
        <text x="240" y="85" font-size="24" font-weight="800" fill="var(--accent)" text-anchor="middle">${v.title}</text>
        <text x="240" y="115" font-size="14" fill="var(--ink-dim)" text-anchor="middle">hơn là</text>
        <text x="240" y="148" font-size="18" fill="var(--ink-dim)" text-anchor="middle">${v.over}</text>
      </g>`;
    });
    let summaryBody = '';
    fourValuesData.forEach((v, i)=>{
      const y = 30 + i*38;
      summaryBody += `<g id="beatSummaryRow${i}">
        <rect x="50" y="${y}" width="380" height="32" rx="9" fill="var(--bg-elev)" stroke="var(--line)" stroke-width="1.5"/>
        <circle cx="68" cy="${y+16}" r="10" fill="var(--accent)"/>
        <text x="68" y="${y+20}" font-size="11" font-weight="800" fill="var(--accent-ink)" text-anchor="middle">${i+1}</text>
        <text x="88" y="${y+14}" font-size="12" font-weight="700" fill="var(--ink)">${v.title}</text>
        <text x="88" y="${y+27}" font-size="10" fill="var(--ink-dim)">hơn là ${v.over}</text>
      </g>`;
    });
    body += `<g id="beatSummary" opacity="0">${summaryBody}</g>`;
  } else if(type === 'twelvePrinciples'){
    const colorMap = { c1, c2, c3, c4 };
    const counts = [0, 0, 0, 0];
    twelvePrinciplesFlat.forEach(p => counts[p.group]++);
    const boxH = counts.map(n => 32 + n * 22);
    const boxY = [];
    let cursor = 10;
    boxH.forEach(h => { boxY.push(cursor); cursor += h + 12; });
    const slotSeen = [0, 0, 0, 0];

    let itemsBody = '';
    const listTop = 12;
    twelvePrinciplesFlat.forEach((p, i)=>{
      const fy = listTop + i * 30;
      itemsBody += `<g id="beatPrinItem${i}" transform="translate(16,${fy})" opacity="0">
        <circle cx="13" cy="8" r="13" fill="var(--accent)"/>
        <text x="13" y="12" font-size="14" font-weight="800" fill="var(--accent-ink)" text-anchor="middle">${i+1}</text>
        <text x="35" y="12" font-size="15" fill="var(--ink)">${p.text}</text>
      </g>`;
    });

    let groupBoxes = '';
    twelvePrinciplesGroupMeta.forEach((grp, gi)=>{
      const color = colorMap[grp.color];
      let lines = '';
      slotSeen[gi] = 0;
      twelvePrinciplesFlat.forEach((p)=>{
        if(p.group !== gi) return;
        const slot = slotSeen[gi]++;
        lines += `<text x="26" y="${boxY[gi]+42+slot*22}" font-size="12" fill="var(--ink-dim)">• ${p.text}</text>`;
      });
      groupBoxes += `<g id="beatPrinBox${gi}">
        <rect x="10" y="${boxY[gi]}" width="460" height="${boxH[gi]}" rx="10" fill="none" stroke="${color}" stroke-width="2"/>
        <text x="26" y="${boxY[gi]+24}" font-size="14" font-weight="800" fill="${color}">${grp.title}</text>
        ${lines}
      </g>`;
    });
    body += `<g id="beatPrinGroups" opacity="0">${groupBoxes}</g>`;
    const listHeight = listTop + 12 * 30 + 14;
    return `<svg viewBox="0 0 480 ${Math.max(cursor, listHeight)}">${itemsBody}${body}</svg>`;
  } else if(type === 'scrumRoles'){
    const nodes = [
      { x: 240, y: 55, label: 'Product Owner', color: c1 },
      { x: 125, y: 135, label: 'Development Team', color: c4 },
      { x: 355, y: 135, label: 'Scrum Master', color: c2 },
    ];
    const pairs = [[0,1],[1,2],[2,0]];
    let linesBody = '';
    pairs.forEach(([a,b])=>{
      linesBody += `<line x1="${nodes[a].x}" y1="${nodes[a].y}" x2="${nodes[b].x}" y2="${nodes[b].y}" stroke="var(--line)" stroke-width="3"/>`;
    });
    body += `<g id="beatScrumLines" opacity="0">${linesBody}</g>`;
    nodes.forEach((n, i)=>{
      const words = n.label.split(' ');
      const lines = words.length > 1 ? [words.slice(0, -1).join(' '), words[words.length-1]] : [n.label];
      const textBody = lines.length > 1
        ? `<text x="${n.x}" y="${n.y-1}" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">${lines[0]}</text>
           <text x="${n.x}" y="${n.y+13}" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">${lines[1]}</text>`
        : `<text x="${n.x}" y="${n.y+5}" font-size="13" font-weight="800" fill="#fff" text-anchor="middle">${lines[0]}</text>`;
      body += `<g id="beatScrumNode${i}" opacity="0">
        <circle cx="${n.x}" cy="${n.y}" r="42" fill="${n.color}" stroke="${n.color}" stroke-width="4"/>
        ${textBody}
      </g>`;
    });
  } else if(type === 'scrumEvents'){
    const cx = 240, cy = 92, R = 62;
    const evNodes = [
      { label: 'Planning', color: c1, x: cx, y: cy - R },
      { label: 'Daily', color: c4, x: cx + R, y: cy },
      { label: 'Review', color: c2, x: cx, y: cy + R },
      { label: 'Retro', color: c3, x: cx - R, y: cy },
    ];
    body += `<g id="beatSprintRing" opacity="0">
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--line)" stroke-width="3" stroke-dasharray="6 5"/>
      <text x="${cx}" y="${cy+5}" font-size="14" font-weight="800" fill="var(--accent)" text-anchor="middle">SPRINT</text>
    </g>`;
    evNodes.forEach((n, i)=>{
      body += `<g id="beatEvNode${i}" opacity="0">
        <circle cx="${n.x}" cy="${n.y}" r="30" fill="${n.color}"/>
        <text x="${n.x}" y="${n.y+5}" font-size="12" font-weight="800" fill="#fff" text-anchor="middle">${n.label}</text>
      </g>`;
    });
  } else if(type === 'scrumArtifacts'){
    const colors = [c1, c4, c2];
    const wrap = (text) => {
      const words = text.split(' ');
      let mid = Math.ceil(words.length / 2);
      while(mid < words.length && words.slice(0, mid).join(' ').length < text.length * 0.42) mid++;
      return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
    };
    scrumArtifactsData.forEach((item, i)=>{
      const [l1, l2] = wrap(item.desc);
      body += `<g id="beatScrum${i}" opacity="0">
        <circle cx="240" cy="55" r="26" fill="none" stroke="${colors[i]}" stroke-width="3"/>
        <text x="240" y="63" font-size="22" font-weight="800" fill="${colors[i]}" text-anchor="middle">${i+1}</text>
        <text x="240" y="112" font-size="20" font-weight="800" fill="${colors[i]}" text-anchor="middle">${item.title}</text>
        <text x="240" y="138" font-size="13" fill="var(--ink-dim)" text-anchor="middle">${l1}</text>
        <text x="240" y="156" font-size="13" fill="var(--ink-dim)" text-anchor="middle">${l2}</text>
      </g>`;
    });
  } else if(type === 'scrumPillars'){
    const colors = [c1, c4, c2];
    const wrap = (text) => {
      const words = text.split(' ');
      let mid = Math.ceil(words.length / 2);
      while(mid < words.length && words.slice(0, mid).join(' ').length < text.length * 0.42) mid++;
      return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
    };
    scrumPillarsData.forEach((item, i)=>{
      const [l1, l2] = wrap(item.desc);
      body += `<g id="beatPillar${i}" opacity="0">
        <circle cx="240" cy="55" r="26" fill="none" stroke="${colors[i]}" stroke-width="3"/>
        <text x="240" y="63" font-size="22" font-weight="800" fill="${colors[i]}" text-anchor="middle">${i+1}</text>
        <text x="240" y="112" font-size="20" font-weight="800" fill="${colors[i]}" text-anchor="middle">${item.title}</text>
        <text x="240" y="138" font-size="13" fill="var(--ink-dim)" text-anchor="middle">${l1}</text>
        <text x="240" y="156" font-size="13" fill="var(--ink-dim)" text-anchor="middle">${l2}</text>
      </g>`;
    });
  } else if(type === 'scrumDefinition'){
    const text = 'Scrum là một khung làm việc linh hoạt (Agile Framework) giúp các đội ngũ phát triển sản phẩm giải quyết các vấn đề phức tạp, thông qua việc chia nhỏ công việc thành các chu kỳ ngắn để liên tục cải tiến và giao sản phẩm nhanh nhất đến tay người dùng.';
    const words = text.split(' ');
    const maxLineLen = 50;
    const lines = [];
    let line = '';
    words.forEach(w => {
      const next = line ? `${line} ${w}` : w;
      if(next.length > maxLineLen){ lines.push(line); line = w; }
      else { line = next; }
    });
    if(line) lines.push(line);
    const lineHeight = 22;
    const startY = 90 - ((lines.length - 1) * lineHeight) / 2;
    let textBody = '';
    lines.forEach((l, i) => {
      textBody += `<text x="240" y="${startY + i * lineHeight}" font-size="12" fill="var(--ink)" text-anchor="middle">${l}</text>`;
    });
    body += `<g id="beatScrumDef" opacity="1">${textBody}</g>`;
  }
  let ground;
  if(type === 'year'){
    let ties = '';
    for(let x = 14; x <= 466; x += 18){
      ties += `<line x1="${x}" y1="102" x2="${x}" y2="110" stroke="var(--line)" stroke-width="3"/>`;
    }
    ground = `<line x1="10" y1="104" x2="470" y2="104" stroke="var(--line)" stroke-width="2.5"/>
      <line x1="10" y1="110" x2="470" y2="110" stroke="var(--line)" stroke-width="2.5"/>
      ${ties}`;
  } else if(type === 'royce' || type === 'crisis1990' || type === 'fourValues' || type === 'scrumRoles' || type === 'scrumEvents' || type === 'scrumArtifacts' || type === 'scrumPillars' || type === 'scrumDefinition'){
    ground = '';
  } else {
    ground = `<line x1="10" y1="${g}" x2="470" y2="${g}" stroke="var(--line)" stroke-width="1.5"/>`;
  }
  return `<svg viewBox="0 0 480 180">${ground}${body}</svg>`;
}

let historyBeats = [];
let historyBeatIndex = 0;

function buildHistoryBeats(type){
  if(type === 'year'){
    return [() => {
      gsap.fromTo('#beatTrain', { x: 520 }, { x: 0, duration: 14, ease: 'sine.out' });
      gsap.to('#beatTrain .beat-wagon circle', { rotation: 360, transformOrigin: '50% 50%', duration: 1, repeat: -1, ease: 'none' });
      gsap.utils.toArray('#beatSmoke .beat-puff').forEach((puff, i) => {
        gsap.fromTo(puff,
          { opacity: 0, scale: 0.4, x: 0, y: 0 },
          { opacity: 0.7, scale: 1.6, x: -10 - i*6, y: -30 - i*10, duration: 1.6, repeat: -1, delay: i*0.55, ease: 'power1.out', transformOrigin: '50% 50%' });
      });
    }];
  }
  if(type === 'royce'){
    return [
      () => gsap.fromTo('#beatPortrait', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }),
      () => gsap.to('#beatDiagram', { opacity: 1, duration: 0.6 }),
      () => gsap.to('#beatWarning', { opacity: 1, duration: 0.5 }),
      () => gsap.fromTo('#beatStamp', { opacity: 0, scale: 2.2 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.in', transformOrigin: '50% 50%' }),
    ];
  }
  if(type === 'waterfall'){
    const stageX = [40, 120, 200, 280, 360];
    const questions = [
      'Không biết đến đâu rồi nhỉ?',
      'Giờ chắc xong chưa ta?',
      'Ơ, tới đâu rồi ấy nhỉ?',
      'Chả biết sao rồi nữa?',
      'Không rõ đến đâu rồi...',
    ];
    const workLines = [
      ['Đang đoán ý khách...', 'khó hơn giải mã Da Vinci!'],
      ['Vẽ đi vẽ lại...', 'bản thứ 9 rồi'],
      ['Code xuyên đêm...', 'cà phê cạn bình thứ 3'],
      ['Bắt lỗi mà như...', 'lỗi đang bắt lại tôi'],
      ['Của anh đây!', 'Của anh đây!'],
    ];
    const askCustomer = (i) => {
      document.getElementById('beatBubbleText1').textContent = questions[i];
    };
    const sayWorker = (i) => {
      document.getElementById('beatWorkerText1').textContent = workLines[i][0];
      document.getElementById('beatWorkerText2').textContent = workLines[i][1];
    };
    const clearCustomer = () => {
      document.getElementById('beatBubbleText1').textContent = '';
    };
    return [
      () => { gsap.to('#beatWorker', { x: stageX[0], duration: 1.6, ease: 'power1.inOut' }); gsap.to('#beatDur0', { opacity: 1, duration: 0.4, delay: 1.4 }); sayWorker(0); askCustomer(0); },
      () => { gsap.to('#beatWorker', { x: stageX[1], duration: 1.6, ease: 'power1.inOut' }); gsap.to('#beatDur1', { opacity: 1, duration: 0.4, delay: 1.4 }); sayWorker(1); askCustomer(1); },
      () => { gsap.to('#beatWorker', { x: stageX[2], duration: 1.6, ease: 'power1.inOut' }); gsap.to('#beatDur2', { opacity: 1, duration: 0.4, delay: 1.4 }); sayWorker(2); askCustomer(2); },
      () => { gsap.to('#beatWorker', { x: stageX[3], duration: 1.6, ease: 'power1.inOut' }); gsap.to('#beatDur3', { opacity: 1, duration: 0.4, delay: 1.4 }); sayWorker(3); askCustomer(3); },
      () => { gsap.to('#beatWorker', { x: stageX[4], duration: 1.6, ease: 'power1.inOut' }); gsap.to('#beatDur4', { opacity: 1, duration: 0.4, delay: 1.4 }); sayWorker(4); clearCustomer(); },
      () => {
        gsap.set(['#beatWorkerText1', '#beatWorkerText2'], { opacity: 0 });
        document.getElementById('beatBubbleText1').textContent = 'Sai yêu cầu rồi, tôi có';
        document.getElementById('beatBubbleText1').setAttribute('fill', 'var(--bad)');
        document.getElementById('beatBubbleText2').textContent = 'bảo làm thế đâu!';
        document.getElementById('beatBubbleText2').setAttribute('fill', 'var(--bad)');
        const tl = gsap.timeline({ delay: 0.4 });
        tl.to('#walkerCrisis', { rotation: -30, transformOrigin: '50% 50%', duration: 0.15 })
          .fromTo('#beatReject', { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(3)' })
          .to('#beatWorker', { x: '-=500', y: -80, rotation: -360, duration: 0.7, ease: 'power2.in' }, '<')
          .to('#beatWorker', { opacity: 0, duration: 0.2 }, '-=0.2')
          .to('#beatReject', { opacity: 0, duration: 0.3 }, '-=0.4');
      },
    ];
  }
  if(type === 'crisis1990'){
    const groups = ['beatCrisisTitle', 'beatCrisisStats'];
    return groups.map((id, i) => () => {
      groups.forEach(gid => { if(gid !== id) gsap.to(`#${gid}`, { opacity: 0, duration: 0.3 }); });
      gsap.fromTo(`#${id}`, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.25 });
    });
  }
  if(type === 'fourValues'){
    const allGroups = [];
    fourValuesData.forEach((_, i) => allGroups.push(`beatProblem${i}`, `beatSolution${i}`));
    const hideAllExcept = (id) => allGroups.forEach(gid => { if(gid !== id) gsap.to(`#${gid}`, { opacity: 0, duration: 0.3 }); });
    const beats = [];
    fourValuesData.forEach((_, i) => {
      beats.push(() => {
        hideAllExcept(`beatProblem${i}`);
        gsap.fromTo(`#beatProblem${i}`, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.25 });
      });
      beats.push(() => {
        gsap.to(`#beatProblem${i}`, { opacity: 0, duration: 0.3 });
        gsap.fromTo(`#beatSolution${i}`, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.25 });
      });
    });
    beats.push(() => {
      allGroups.forEach(gid => gsap.to(`#${gid}`, { opacity: 0, duration: 0.3 }));
      gsap.to('#beatSummary', { opacity: 1, duration: 0.3, delay: 0.3 });
      gsap.fromTo('#beatSummary [id^="beatSummaryRow"]', { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.4, delay: 0.4, stagger: 0.12, ease: 'power2.out' });
    });
    return beats;
  }
  if(type === 'twelvePrinciples'){
    const listBeat = () => {
      gsap.fromTo('[id^="beatPrinItem"]', { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out' });
    };
    const groupBeat = () => {
      gsap.to('[id^="beatPrinItem"]', { opacity: 0, duration: 0.3 });
      gsap.fromTo('#beatPrinGroups', { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.35 });
    };
    return [listBeat, groupBeat];
  }
  if(type === 'scrumDefinition'){
    return [];
  }
  if(type === 'scrumRoles'){
    return [
      () => gsap.fromTo('#beatScrumLines', { opacity: 0 }, { opacity: 1, duration: 0.4 }),
      () => gsap.fromTo(['#beatScrumNode0', '#beatScrumNode1', '#beatScrumNode2'], { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.15, ease: 'back.out(2)', transformOrigin: '50% 50%' }),
    ];
  }
  if(type === 'scrumEvents'){
    const beats = [() => gsap.fromTo('#beatSprintRing', { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5, transformOrigin: '50% 50%' })];
    [0, 1, 2, 3].forEach(i => {
      beats.push(() => {
        gsap.fromTo(`#beatEvNode${i}`, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)', transformOrigin: '50% 50%' });
      });
    });
    return beats;
  }
  if(type === 'scrumArtifacts'){
    const count = scrumArtifactsData.length;
    const beats = Array.from({ length: count }, (_, i) => () => {
      for(let j = 0; j < count; j++){ if(j !== i) gsap.to(`#beatScrum${j}`, { opacity: 0, duration: 0.3 }); }
      gsap.fromTo(`#beatScrum${i}`, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.25 });
    });
    return beats;
  }
  if(type === 'scrumPillars'){
    const count = scrumPillarsData.length;
    const beats = Array.from({ length: count }, (_, i) => () => {
      for(let j = 0; j < count; j++){ if(j !== i) gsap.to(`#beatPillar${j}`, { opacity: 0, duration: 0.3 }); }
      gsap.fromTo(`#beatPillar${i}`, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.25 });
    });
    return beats;
  }
  if(type === 'independentIdeas'){
    const peopleBeats = [0, 1, 2].map(i => () => {
      gsap.fromTo(`#beatIdea${i}`, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    });
    const sparkBeat = () => {
      gsap.to('#beatSparks', { opacity: 1, duration: 0.3 });
      gsap.to('#beatSparks g', {
        scaleY: 1.15, scaleX: 0.92, duration: 0.15, repeat: -1, yoyo: true, ease: 'sine.inOut',
        transformOrigin: '50% 100%',
      });
    };
    const chickenBeat = () => gsap.fromTo('#beatChicken', { opacity: 0 }, { opacity: 1, duration: 0.5 });
    const beerBeat = () => gsap.fromTo('#beatBeers', { opacity: 0 }, { opacity: 1, duration: 0.5 });
    const targetBeat = () => {
      gsap.to(['#beatSparks', '#beatChicken'], { opacity: 0, duration: 0.4 });
      gsap.fromTo('#beatEnemyTarget', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.5, delay: 0.3, ease: 'back.out(2)', transformOrigin: '50% 50%' });
    };
    const crackBeat = () => gsap.fromTo('#beatEnemyCrack', { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(3)', transformOrigin: '50% 50%' });
    return [...peopleBeats, sparkBeat, chickenBeat, beerBeat, targetBeat, crackBeat];
  }
  return [];
}

function runNextHistoryBeat(){
  if(historyBeatIndex >= historyBeats.length) return;
  historyBeats[historyBeatIndex]();
  historyBeatIndex++;
}

function handleHistoryScreenClick(){
  if(historyBeatIndex < historyBeats.length){
    runNextHistoryBeat();
  } else {
    historyNext();
  }
}

function animateHistoryScene(type, revealAll){
  if(!window.gsap) return;
  historyBeats = buildHistoryBeats(type);
  historyBeatIndex = 0;
  if(revealAll){
    gsap.globalTimeline.timeScale(60);
    while(historyBeatIndex < historyBeats.length) runNextHistoryBeat();
    setTimeout(()=>{ if(window.gsap) gsap.globalTimeline.timeScale(1); }, 60);
  } else {
    runNextHistoryBeat();
  }
}

function renderHistorySlide(i, revealAll){
  const slide = historySlides[i];
  document.getElementById('histTag').textContent = slide.tag;
  document.getElementById('histScene').innerHTML = buildHistoryScene(slide.scene);
  if(window.lucide) lucide.createIcons();
  animateHistoryScene(slide.scene, revealAll);
}

function historyBeatBack(){
  const slide = historySlides[historyIndex];
  const target = historyBeatIndex - 1;
  document.getElementById('histScene').innerHTML = buildHistoryScene(slide.scene);
  historyBeats = buildHistoryBeats(slide.scene);
  historyBeatIndex = 0;
  if(window.gsap){
    gsap.globalTimeline.timeScale(60);
    while(historyBeatIndex < target) runNextHistoryBeat();
    setTimeout(()=>{ if(window.gsap) gsap.globalTimeline.timeScale(1); }, 60);
  }
}

function handleHistoryScreenKey(e){
  const screen = document.getElementById('historyScreen');
  if(screen.classList.contains('hidden')) return;
  if(e.key === 'ArrowLeft'){
    historyPrev();
  } else if(e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter'){
    handleHistoryScreenClick();
  }
}
document.addEventListener('keydown', handleHistoryScreenKey);

function toggleSprintGoal(btn){
  btn.nextElementSibling.classList.remove('hidden');
  btn.remove();
}

let heroQuoteRevealed = false;
function handleStartScreenClick(){
  if(!heroQuoteRevealed){
    heroQuoteRevealed = true;
    const quote = document.getElementById('heroQuote');
    if(window.gsap) gsap.to(quote, { opacity: 1, y: 0, duration: 0.6 });
    else quote.style.opacity = 1;
    return;
  }
  showHistory();
}

function showHistory(){
  switchScreen('historyScreen', ['startScreen']);
  historyIndex = 0;
  renderHistorySlide(historyIndex);
}

function historyNext(){
  if(historyIndex < historySlides.length - 1){
    historyIndex++;
    renderHistorySlide(historyIndex);
  } else {
    showBrief();
  }
}

function historyPrev(){
  if(historyBeatIndex > 0){
    historyBeatBack();
  } else if(historyIndex > 0){
    historyIndex--;
    renderHistorySlide(historyIndex, true);
  }
}

function showBrief(){
  switchScreen('briefScreen', ['historyScreen']);
  if(window.lucide) lucide.createIcons();
  initLabGame();
}

function pickProjectModel(model){
  if(model === 'waterfall'){
    triggerWaterfallGameOver();
    return;
  }
  document.getElementById('inlineModelChoice').style.display = 'none';
  const outcome = document.getElementById('outcome');
  outcome.className = 'outcome show good';
  outcome.innerHTML = '<i data-lucide="sprout"></i> Đội chọn Agile: chia nhỏ thành các Sprint ngắn, demo thường xuyên, thích ứng khi có thay đổi.';
  document.getElementById('nextBtn').classList.add('show');
  if(window.lucide) lucide.createIcons();
}

function triggerWaterfallGameOver(){
  switchScreen('gameOverScreen', ['gameScreen']);
  document.getElementById('goScene').innerHTML = buildScene('alert');
  document.getElementById('gameOverText').innerHTML =
    'Đội chọn Waterfall: dành trọn 5 ngày đầu để hoàn thiện tài liệu thiết kế chi tiết cho toàn bộ hệ thống — đăng nhập, đăng xuất, quên mật khẩu, số dư ảo — trước khi viết bất kỳ dòng code nào. ' +
    'Đến <b>ngày thứ 5</b>, khách hàng hẹn xem tiến độ nhưng chỉ được xem tài liệu, chưa có gì chạy được. Khách hàng cho rằng dự án đang trễ và mất kiểm soát — gửi cảnh báo phạt chậm tiến độ theo hợp đồng, yêu cầu dừng dự án để đánh giá lại và cân nhắc tìm đối tác khác.';
  if(window.lucide) lucide.createIcons();
}

function startGame(){
  switchScreen('gameScreen', ['startScreen', 'briefScreen', 'gameOverScreen']);
  renderProgress();
  updateCustomerMood();
  loadDay();
}

const phaseIcon = {
  customer: 'handshake', charter: 'file-signature', meeting: 'users',
  solo: 'clipboard-list', planning: 'kanban', standup: 'users-round',
  alert: 'alert-triangle', review: 'presentation', retro: 'refresh-cw', release: 'rocket'
};

let currentVotes = [];
let otherVotes = 0;
let answerRevealed = false;

function renderVoteRow(opt, idx){
  return `<div class="vote-row" id="voteRow-${idx}">
    <span class="vote-label">${opt.label}</span>
    <span class="vote-count" id="voteCount-${idx}">${currentVotes[idx]}</span>
    <button class="vote-plus" id="votePlus-${idx}" onclick="voteOption(${idx})" aria-label="Tăng phiếu"><i data-lucide="plus"></i></button>
  </div>`;
}

function loadDay(){
  const d = days[current];
  renderProgress();

  const tagIcon = phaseIcon[d.scene] || 'circle-dot';
  document.getElementById('dayTag').innerHTML = `<i data-lucide="${tagIcon}"></i> ${d.phase}`;
  const sceneQuote = document.getElementById('sceneQuote');
  if(d.quote){
    sceneQuote.textContent = `"${d.quote}"`;
    sceneQuote.style.display = '';
  } else {
    sceneQuote.style.display = 'none';
  }
  document.getElementById('dayScene').innerHTML = buildScene(d.scene);
  document.getElementById('dayBody').innerHTML = d.body || '';

  if(window.gsap){
    const card = document.querySelector('.day-card-split');
    if(card) gsap.fromTo(card, {opacity:0, y:14}, {opacity:1, y:0, duration:0.5, ease:'power2.out'});
  }

  if(d.scene === 'customer'){
    const walker = document.getElementById('walkerCustomer');
    if(walker && window.gsap){
      gsap.fromTo(walker, {x:-160, opacity:0}, {x:0, opacity:1, duration:1.1, ease:'power2.out', delay:0.15});
    }
  }

  const decisionBox = document.getElementById('decisionBox');
  const outcome = document.getElementById('outcome');
  const nextBtn = document.getElementById('nextBtn');
  outcome.className = 'outcome';
  outcome.innerHTML = '';
  nextBtn.classList.remove('show');
  decisionBox.style.display = 'none';
  closeOutcomeDialog();

  document.getElementById('dayBody').style.display = 'none';
  document.getElementById('inlineModelChoice').style.display = 'none';

  if(d.decision){
    document.getElementById('decisionQ').textContent = d.decision.question;
    currentVotes = d.decision.options.map(()=>0);
    otherVotes = 0;
    answerRevealed = false;
    document.getElementById('otherVoteCount').textContent = '0';
    document.getElementById('otherVotePlus').disabled = false;
    document.getElementById('otherRow').classList.remove('revealed');
    document.getElementById('revealAnswerBtn').classList.remove('hidden');

    const optsWrap = document.getElementById('decisionOpts');
    optsWrap.innerHTML = '';
    const shuffledOptions = shuffled(d.decision.options.map((opt, idx) => ({ opt, idx })));
    shuffledOptions.forEach(({opt, idx})=>{
      optsWrap.insertAdjacentHTML('beforeend', renderVoteRow(opt, idx));
    });
  }

  if(window.lucide) lucide.createIcons();

  revealDayContent();
}

function revealDayContent(){
  const d = days[current];
  document.getElementById('dayBody').style.display = 'block';

  if(d.modelChoice){
    document.getElementById('inlineModelChoice').style.display = 'flex';
  } else if(d.decision){
    document.getElementById('decisionBox').style.display = 'flex';
  } else {
    if(d.reveal){ revealMock(d.reveal); }
    document.getElementById('nextBtn').classList.add('show');
  }
  if(window.lucide) lucide.createIcons();
}

const typeIcon = { good: 'check-circle-2', rigid: 'x-circle', anti: 'x-circle' };
const typeLabel = { good: 'Lựa chọn đúng', rigid: 'Quá cứng nhắc (kiểu Waterfall)', anti: 'Phản ứng thái quá (lệch lạc)' };

function voteOption(idx){
  if(answerRevealed) return;
  currentVotes[idx]++;
  document.getElementById('voteCount-' + idx).textContent = currentVotes[idx];
}

function voteOther(){
  if(answerRevealed) return;
  otherVotes++;
  document.getElementById('otherVoteCount').textContent = otherVotes;
}

function revealAnswer(){
  if(answerRevealed) return;
  answerRevealed = true;
  const d = days[current];

  document.querySelectorAll('.vote-plus').forEach(b=>b.disabled = true);
  document.getElementById('revealAnswerBtn').classList.add('hidden');

  let maxIdx = 0;
  d.decision.options.forEach((o,i)=>{ if(currentVotes[i] > currentVotes[maxIdx]) maxIdx = i; });
  const winner = d.decision.options[maxIdx];
  const totalVotes = currentVotes.reduce((a,b)=>a+b, 0) + otherVotes;

  d.decision.options.forEach((opt, idx)=>{
    const row = document.getElementById('voteRow-' + idx);
    if(row) row.classList.add('revealed', opt.type);
  });

  trust = Math.max(0, Math.min(100, trust + winner.delta));
  updateCustomerMood();

  const outcome = document.getElementById('outcome');
  outcome.className = 'outcome show ' + (winner.type === 'good' ? 'good' : 'bad');

  const breakdown = d.decision.options.map((o,i)=>{
    return `<div class="opt-review ${o.type}">
      <div class="opt-review-head"><i data-lucide="${typeIcon[o.type]}"></i> <b>${typeLabel[o.type]}</b> <span class="mono">${currentVotes[i]} phiếu</span></div>
      <div class="opt-review-label">${o.label}</div>
      <div class="opt-review-outcome">${o.outcome}</div>
    </div>`;
  }).join('') + (otherVotes > 0 ? `<div class="opt-review"><div class="opt-review-head"><i data-lucide="message-circle"></i> <b>Ý kiến khác</b> <span class="mono">${otherVotes} phiếu</span></div></div>` : '');

  const winnerLine = totalVotes > 0
    ? `<div class="opt-review-title">Số đông chọn: <b>${typeLabel[winner.type]}</b> (${currentVotes[maxIdx]}/${totalVotes} phiếu).</div>`
    : `<div class="opt-review-title">Chưa có ai bình chọn — đây là đánh giá từng phương án:</div>`;

  const principleTagHtml = d.decision.principleTag
    ? `<div class="principle-tag"><i data-lucide="lightbulb"></i> ${d.decision.principleTag}</div>` : '';

  outcome.innerHTML = winnerLine + breakdown + principleTagHtml;
  openOutcomeDialog();

  if(winner.type === 'good'){
    confetti({ particleCount: 50, spread: 50, origin: { x: 0.5, y: 0.5 } });
  }
  if(window.lucide) lucide.createIcons();

  document.getElementById('nextBtn').classList.add('show');
}

function openOutcomeDialog(){
  document.getElementById('outcomeDialog').classList.remove('hidden');
}

function closeOutcomeDialog(){
  document.getElementById('outcomeDialog').classList.add('hidden');
}

function revealMock(ids){
  ids.forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.classList.add('on');
    gsap.fromTo(el, {opacity:0, y:6}, {opacity:1, y:0, duration:0.6, ease:'power2.out'});
    if(id === 'mock-login'){ document.getElementById('mock-login-empty').style.display = 'none'; }
    if(id === 'mock-dashboard'){ document.getElementById('mock-dash-empty').style.display = 'none'; }
    if(id === 'mock-balance'){ animateBalance(); }
  });
}

function updateCustomerMood(){
  const face = document.getElementById('moodFace');
  const text = document.getElementById('moodText');
  const box = document.getElementById('customerMood');
  if(!face) return;
  let emoji, msg, cls;
  if(trust >= 70){ emoji = '😄'; msg = 'Rất hài lòng, tin tưởng đội'; cls = 'good'; }
  else if(trust >= 45){ emoji = '😐'; msg = 'Còn nghi ngại, đang theo dõi sát'; cls = 'warn'; }
  else { emoji = '😠'; msg = 'Lo lắng, mất dần niềm tin'; cls = 'bad'; }
  face.textContent = emoji;
  text.textContent = msg;
  box.className = 'customer-mood ' + cls;
  if(window.gsap) gsap.fromTo(face, {scale:0.7}, {scale:1, duration:0.4, ease:'back.out(2)'});
}

function animateBalance(){
  const el = document.getElementById('mock-balance-num');
  const obj = { v: 0 };
  gsap.to(obj, {
    v: 1250000, duration: 1.4, ease: 'power1.out',
    onUpdate: ()=>{ el.textContent = Math.round(obj.v).toLocaleString('vi-VN'); }
  });
}

function nextDay(){
  current++;
  if(current >= days.length){
    finishGame();
  } else {
    loadDay();
  }
}

function finishGame(){
  switchScreen('endScreen', ['gameScreen']);
  document.getElementById('finalDays').textContent = days.length;

  const verdictEl = document.getElementById('finalVerdict');
  const statEl = document.getElementById('finalVerdictStat');
  let verdictHtml, verdictClass;
  if(trust >= 70){
    verdictHtml = '<i data-lucide="thumbs-up"></i> Có, khách hàng tin tưởng đội';
    verdictClass = 'good';
  } else if(trust >= 45){
    verdictHtml = '<i data-lucide="help-circle"></i> Còn nghi ngại, chưa hoàn toàn yên tâm';
    verdictClass = 'warn';
  } else {
    verdictHtml = '<i data-lucide="thumbs-down"></i> Không, khách hàng mất niềm tin';
    verdictClass = 'bad';
  }
  verdictEl.innerHTML = verdictHtml;
  statEl.className = 'stat verdict ' + verdictClass;

  confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
  if(window.lucide) lucide.createIcons();
}

function restartGame(){
  current = 0;
  trust = 80;
  updateCustomerMood();
  switchScreen('startScreen', ['endScreen', 'gameOverScreen']);
  renderProgress();
  if(window.lucide) lucide.createIcons();
}

if(window.lucide) lucide.createIcons();
