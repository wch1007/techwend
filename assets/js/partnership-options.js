(function () {
  'use strict';

  const tailRoot = document.getElementById('partnership-shared-tail');
  if (tailRoot) {
    tailRoot.innerHTML = `
      <section class="pt-section pt-section--center panel" id="form">
        <div class="pt-container data-reveal">
          <div class="pt-kicker" data-zh="Get Started" data-en="Get Started">Get Started</div>
          <h2 class="pt-title" data-zh="商务合作入口" data-en="Partnership Inquiry">商务合作入口</h2>
          <form class="pt-form-wrap pt-form" id="partnership-form">
            <label for="co-name" data-zh="公司 / 机构名称" data-en="Company / Organization">公司 / 机构名称</label>
            <input type="text" id="co-name" name="company" required>
            <label for="co-contact" data-zh="联系方式（手机 / 邮箱）" data-en="Contact (phone / email)">联系方式（手机 / 邮箱）</label>
            <input type="text" id="co-contact" name="contact" required>
            <label for="co-type" data-zh="合作类型" data-en="Partnership Type">合作类型</label>
            <select id="co-type" name="type">
              <option value="standard" data-zh="标准采购" data-en="Standard Procurement">标准采购</option>
              <option value="integration" data-zh="产品集成" data-en="Product Integration">产品集成</option>
              <option value="sdk" data-zh="SDK / API 授权" data-en="SDK / API Licensing">SDK / API 授权</option>
              <option value="custom" data-zh="定制开发" data-en="Custom Development">定制开发</option>
              <option value="channel" data-zh="渠道合作" data-en="Channel Partnership">渠道合作</option>
              <option value="other" data-zh="其他" data-en="Other">其他</option>
            </select>
            <label for="co-scene" data-zh="应用场景" data-en="Application Scenario">应用场景</label>
            <select id="co-scene" name="scene">
              <option value="ip" data-zh="IP / 内容" data-en="IP / Content">IP / 内容</option>
              <option value="culture" data-zh="文旅展陈" data-en="Culture & Tourism">文旅展陈</option>
              <option value="education" data-zh="教育科研" data-en="Education & Research">教育科研</option>
              <option value="commercial" data-zh="商业空间" data-en="Commercial Space">商业空间</option>
              <option value="enterprise" data-zh="企业服务" data-en="Enterprise Services">企业服务</option>
              <option value="government" data-zh="公共服务" data-en="Public Services">公共服务</option>
              <option value="other" data-zh="其他" data-en="Other">其他</option>
            </select>
            <label for="co-desc" data-zh="需求描述" data-en="Requirements">需求描述</label>
            <textarea id="co-desc" name="description" data-ph-zh="请简要描述合作目标、预期场景与时间节点" data-ph-en="Briefly describe partnership goals, target scenarios, and timeline" placeholder="请简要描述合作目标、预期场景与时间节点"></textarea>
            <button type="submit" class="btn btn--outline" data-zh="提交合作意向" data-en="Submit Inquiry">提交合作意向</button>
            <p class="pt-form-note" data-zh="提交后我们将在 1–3 个工作日内与您联系，进一步沟通合作方案。" data-en="We will contact you within 1–3 business days to discuss next steps.">提交后我们将在 1–3 个工作日内与您联系，进一步沟通合作方案。</p>
          </form>
        </div>
      </section>

      <div class="snap-group">
        <section class="panel pt-section pt-faq-panel" id="faq" data-pt-faq style="background:var(--bg2)">
          <div class="pt-container">
            <div class="pt-faq__head data-reveal">
              <div class="pt-kicker" data-zh="FAQ" data-en="FAQ">FAQ</div>
              <h2 class="pt-title" data-zh="常见问题" data-en="Frequently Asked Questions">常见问题</h2>
            </div>
            <div class="pt-faq">
              <div class="pt-faq-item">
                <h3 data-zh="从接触到样机交付通常需要多久？" data-en="How long from first contact to prototype delivery?">从接触到样机交付通常需要多久？</h3>
                <p data-zh="标准采购可在数周内完成；定制开发项目视复杂度，PoC 验证通常 4–12 周，完整交付 3–6 个月起。我们会在需求沟通阶段给出明确时间表。" data-en="Standard procurement: weeks. Custom projects: PoC in 4–12 weeks, full delivery from 3–6 months. Timeline confirmed during discovery.">标准采购可在数周内完成；定制开发项目视复杂度，PoC 验证通常 4–12 周，完整交付 3–6 个月起。我们会在需求沟通阶段给出明确时间表。</p>
              </div>
              <div class="pt-faq-item">
                <h3 data-zh="定制开发的边界是什么？" data-en="What are the limits of customization?">定制开发的边界是什么？</h3>
                <p data-zh="我们支持外观、动作、内容、智能体人格、系统接口与运营流程的组合定制。超出桌面级人形机器人形态或现有技术栈的能力边界，将在方案设计阶段提前说明。" data-en="We customize appearance, motion, content, agent persona, APIs, and operations. Capabilities beyond our desktop humanoid stack are clarified during solution design.">我们支持外观、动作、内容、智能体人格、系统接口与运营流程的组合定制。超出桌面级人形机器人形态或现有技术栈的能力边界，将在方案设计阶段提前说明。</p>
              </div>
              <div class="pt-faq-item">
                <h3 data-zh="用户交互数据如何处理？" data-en="How is interaction data handled?">用户交互数据如何处理？</h3>
                <p data-zh="我们遵循最小必要原则采集数据，支持私有化部署与数据隔离方案。具体数据处理策略将在合同中与合作伙伴明确约定。" data-en="We follow data minimization principles and support private deployment and data isolation. Policies are defined in partnership agreements.">我们遵循最小必要原则采集数据，支持私有化部署与数据隔离方案。具体数据处理策略将在合同中与合作伙伴明确约定。</p>
              </div>
              <div class="pt-faq-item">
                <h3 data-zh="是否提供售后与运维支持？" data-en="Do you provide after-sales and operational support?">是否提供售后与运维支持？</h3>
                <p data-zh="标准采购含基础质保与远程技术支持；定制项目可选购现场运维、内容更新与 OTA 升级服务包。" data-en="Standard procurement includes warranty and remote support. Custom projects can add on-site maintenance, content updates, and OTA packages.">标准采购含基础质保与远程技术支持；定制项目可选购现场运维、内容更新与 OTA 升级服务包。</p>
              </div>
              <div class="pt-faq-item">
                <h3 data-zh="如何成为区域渠道代理？" data-en="How to become a regional channel partner?">如何成为区域渠道代理？</h3>
                <p data-zh="请通过本页表单选择「渠道合作」，说明目标区域与行业资源。我们将评估渠道能力后安排商务对接。" data-en="Submit the form with 'Channel Partnership' and describe your region and industry resources.">请通过本页表单选择「渠道合作」，说明目标区域与行业资源。我们将评估渠道能力后安排商务对接。</p>
              </div>
              <div class="pt-faq-item">
                <h3 data-zh="IP 合作需要哪些授权材料？" data-en="What IP licensing materials are required?">IP 合作需要哪些授权材料？</h3>
                <p data-zh="需具备 IP 合法授权或版权方书面许可，包括角色形象、语音、世界观等要素的使用范围。我们可协助梳理合规清单。" data-en="Valid IP licensing or written permission for character design, voice, and worldview usage is required. We can help with compliance checklists.">需具备 IP 合法授权或版权方书面许可，包括角色形象、语音、世界观等要素的使用范围。我们可协助梳理合规清单。</p>
              </div>
            </div>
          </div>
        </section>

        <footer class="site-footer" id="footer">
          <div class="footer__grid">
            <div>
              <div class="footer__name" data-zh="汤问致新（北京）机器人科技有限公司" data-en="Techvoyage (Beijing) Robotics Technology Co., Ltd.">汤问致新（北京）机器人科技有限公司</div>
              <p class="footer__tag" data-zh="致力于打造新一代最还原、最智能的消费级具身伙伴机器人终端，让科技拥有温度。" data-en="Dedicated to building the most authentic and intelligent next-generation consumer embodied companion robot.">致力于打造新一代最还原、最智能的消费级具身伙伴机器人终端，让科技拥有温度。</p>
            </div>
            <div class="footer__contact">
              <div class="footer__row"><span class="footer__lbl" data-zh="地址" data-en="ADDR">地址</span><span class="footer__val" data-zh="黑龙江省哈尔滨市南岗区邮政街副434号<br/>哈工大国家大学科技园 412" data-en="HIT National University Science Park 412,<br/>Youzheng St, Nangang, Harbin">黑龙江省哈尔滨市南岗区邮政街副434号<br/>哈工大国家大学科技园 412</span></div>
              <div class="footer__row"><span class="footer__lbl" data-zh="电话" data-en="TEL">电话</span><span class="footer__val">+86 186 6199 6738</span></div>
              <div class="footer__row"><span class="footer__lbl" data-zh="邮件" data-en="EMAIL">邮件</span><span class="footer__val"><a href="mailto:sunxy@techvoyage.site">sunxy@techvoyage.site</a></span></div>
            </div>
            <div>
              <div class="footer__social-ttl" data-zh="关注我们" data-en="FOLLOW US">关注我们</div>
              <div class="footer__socials"><a href="#" data-zh="微信" data-en="WeChat">微信 WeChat</a><a href="#" data-zh="微博" data-en="Weibo">微博 Weibo</a><a href="#">GitHub</a></div>
            </div>
          </div>
          <div class="footer__bottom"><span data-zh="© 2026 汤问致新（北京）机器人科技有限公司 版权所有" data-en="© 2026 Techvoyage (Beijing) Robotics Technology Co., Ltd. All rights reserved.">© 2026 汤问致新（北京）机器人科技有限公司 版权所有</span><span data-zh="让科技拥有温度" data-en="Tech flowing gentle warmth in your heart">让科技拥有温度</span></div>
        </footer>
      </div>`;
  }

  document.querySelectorAll('.pt-faq-item').forEach(function (item) {
    const heading = item.querySelector('h3');
    if (!heading) return;
    item.dataset.questionZh = heading.dataset.zh || heading.textContent;
    item.dataset.questionEn = heading.dataset.en || heading.textContent;
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.pt-faq-item').forEach(function (item) {
      const toggle = item.querySelector('.pt-faq-toggle');
      if (!toggle) return;
      toggle.dataset.zh = item.dataset.questionZh || toggle.textContent;
      toggle.dataset.en = item.dataset.questionEn || toggle.textContent;
    });
  });

  const form = document.getElementById('partnership-form');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const company = document.getElementById('co-name').value;
      const contact = document.getElementById('co-contact').value;
      const type = document.getElementById('co-type');
      const scene = document.getElementById('co-scene');
      const desc = document.getElementById('co-desc').value;
      const subject = encodeURIComponent('【商务合作】' + company);
      const body = encodeURIComponent(
        '公司/机构：' + company + '\n' +
        '联系方式：' + contact + '\n' +
        '合作类型：' + type.options[type.selectedIndex].text + '\n' +
        '应用场景：' + scene.options[scene.selectedIndex].text + '\n\n' +
        '需求描述：\n' + desc
      );
      window.location.href = 'mailto:sunxy@techvoyage.site?subject=' + subject + '&body=' + body;
    });
  }

  function currentLanguage() {
    return document.documentElement.dataset.lang === 'en' ? 'en' : 'zh';
  }

  document.querySelectorAll('[data-scene-scope]').forEach(function (scope) {
    const buttons = Array.from(scope.querySelectorAll('[data-scene-option]'));
    const media = scope.querySelector('[data-scene-media]');
    const image = scope.querySelector('[data-scene-image]');
    const count = scope.querySelector('[data-scene-count]');
    const tech = scope.querySelector('[data-scene-tech]');
    const title = scope.querySelector('[data-scene-title]');
    const desc = scope.querySelector('[data-scene-desc]');
    const partner = scope.querySelector('[data-scene-partner]');
    let timer = 0;

    function localized(button, key) {
      return button.dataset[key + (currentLanguage() === 'en' ? 'En' : 'Zh')] || '';
    }

    function activate(button, index) {
      buttons.forEach(function (item) {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });

      if (media) media.classList.add('is-changing');
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        if (image && button.dataset.image) {
          image.src = button.dataset.image;
          image.alt = localized(button, 'title');
        }
        if (count) count.textContent = String(index + 1).padStart(2, '0');
        [
          [tech, 'tech'],
          [title, 'title'],
          [desc, 'desc'],
          [partner, 'partner']
        ].forEach(function (entry) {
          const node = entry[0];
          const key = entry[1];
          if (!node) return;
          node.dataset.zh = button.dataset[key + 'Zh'] || '';
          node.dataset.en = button.dataset[key + 'En'] || '';
          node.innerHTML = localized(button, key);
        });
        if (media) media.classList.remove('is-changing');
      }, 180);
    }

    buttons.forEach(function (button, index) {
      button.addEventListener('click', function () { activate(button, index); });
    });
  });
})();
