// 交互脚本：移动导航、滚动 reveal、微交互
document.addEventListener('DOMContentLoaded', function(){
  // 移动导航开关
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  toggle && toggle.addEventListener('click', ()=>{
    const shown = links.style.display === 'flex';
    links.style.display = shown ? 'none' : 'flex';
  });

  // 滚动 reveal：IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('show');
        // 取消观察以提高性能
        io.unobserve(e.target);
      }
    })
  },{threshold:0.15});
  reveals.forEach(r=>io.observe(r));

  // 鼠标滑过 project 卡片时添加轻微倾斜效果
  document.querySelectorAll('.project-card').forEach(card=>{
    card.addEventListener('mousemove', (e)=>{
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-10px) scale(1.01) rotateX(${ -y * 4 }deg) rotateY(${ x * 6 }deg)`;
    });
    card.addEventListener('mouseleave', ()=>{
      card.style.transform = '';
    });
  });
});
