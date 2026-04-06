/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Input,
  ScrollList,
  ScrollItem,
} from '@douyinfe/semi-ui';
import { API, showError, copy, showSuccess } from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { API_ENDPOINTS } from '../../constants/common.constant';
import { StatusContext } from '../../context/Status';
import { useActualTheme } from '../../context/Theme';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import {
  IconGithubLogo,
  IconPlay,
  IconFile,
  IconCopy,
} from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import {
  Moonshot,
  OpenAI,
  XAI,
  Zhipu,
  Volcengine,
  Cohere,
  Claude,
  Gemini,
  Suno,
  Minimax,
  Wenxin,
  Spark,
  Qingyan,
  DeepSeek,
  Qwen,
  Midjourney,
  Grok,
  AzureAI,
  Hunyuan,
  Xinference,
} from '@lobehub/icons';

const { Text } = Typography;

// 特性图标：货币/成本
const CostIcon = () => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.5'
    className='w-5 h-5'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'
    />
  </svg>
);

// 特性图标：稳定性/盾牌
const StabilityIcon = () => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.5'
    className='w-5 h-5'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z'
    />
  </svg>
);

// 特性图标：即刻接入/代码
const MigrateIcon = () => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.5'
    className='w-5 h-5'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5'
    />
  </svg>
);

// 特性图标：用量管控/图表
const AnalyticsIcon = () => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.5'
    className='w-5 h-5'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z'
    />
  </svg>
);

// 核心优势卡片数据
const FEATURES = [
  {
    icon: <CostIcon />,
    title: '显著降低成本',
    desc: '通过规模化采购折扣与多渠道路由优化，API 调用成本显著低于官方直连价格，帮助团队大幅削减 AI 开支。',
  },
  {
    icon: <StabilityIcon />,
    title: '高可用保障',
    desc: '多通道并行部署与智能故障转移机制，在线路可用的前提下最大化服务稳定性，业务不受单点故障影响。',
  },
  {
    icon: <MigrateIcon />,
    title: '一行代码迁移',
    desc: '完全兼容 OpenAI API 规范，仅需将 Base URL 替换为我们的地址，无需修改任何业务逻辑即可完成接入。',
  },
  {
    icon: <AnalyticsIcon />,
    title: '精细用量管控',
    desc: '实时 Token 用量统计、团队多账户配额分配、按模型和渠道的成本拆解，让每一分 AI 开销都清晰可见。',
  },
];

// AI 供应商图标列表
const PROVIDERS = [
  { key: 'openai', el: <OpenAI size={36} /> },
  { key: 'claude', el: <Claude.Color size={36} /> },
  { key: 'gemini', el: <Gemini.Color size={36} /> },
  { key: 'deepseek', el: <DeepSeek.Color size={36} /> },
  { key: 'grok', el: <Grok size={36} /> },
  { key: 'qwen', el: <Qwen.Color size={36} /> },
  { key: 'moonshot', el: <Moonshot size={36} /> },
  { key: 'xai', el: <XAI size={36} /> },
  { key: 'zhipu', el: <Zhipu.Color size={36} /> },
  { key: 'volcengine', el: <Volcengine.Color size={36} /> },
  { key: 'cohere', el: <Cohere.Color size={36} /> },
  { key: 'azureai', el: <AzureAI.Color size={36} /> },
  { key: 'minimax', el: <Minimax.Color size={36} /> },
  { key: 'wenxin', el: <Wenxin.Color size={36} /> },
  { key: 'spark', el: <Spark.Color size={36} /> },
  { key: 'qingyan', el: <Qingyan.Color size={36} /> },
  { key: 'suno', el: <Suno size={36} /> },
  { key: 'midjourney', el: <Midjourney size={36} /> },
  { key: 'hunyuan', el: <Hunyuan.Color size={36} /> },
  { key: 'xinference', el: <Xinference.Color size={36} /> },
];

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const isMobile = useIsMobile();
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;
  const docsLink = statusState?.status?.docs_link || '';
  const serverAddress =
    statusState?.status?.server_address || `${window.location.origin}`;
  const endpointItems = API_ENDPOINTS.map((e) => ({ value: e }));
  const [endpointIndex, setEndpointIndex] = useState(0);
  const isChinese = i18n.language.startsWith('zh');

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);

      if (data.startsWith('https://')) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.onload = () => {
            iframe.contentWindow.postMessage({ themeMode: actualTheme }, '*');
            iframe.contentWindow.postMessage({ lang: i18n.language }, '*');
          };
        }
      }
    } else {
      showError(message);
      setHomePageContent('加载首页内容失败...');
    }
    setHomePageContentLoaded(true);
  };

  const handleCopyBaseURL = async () => {
    const ok = await copy(serverAddress);
    if (ok) {
      showSuccess(t('已复制到剪切板'));
    }
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };
    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    displayHomePageContent().then();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setEndpointIndex((prev) => (prev + 1) % endpointItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [endpointItems.length]);

  return (
    <div className='w-full overflow-x-hidden'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />

      {homePageContentLoaded && homePageContent === '' ? (
        <div className='w-full'>
          {/* ── Hero 区域 ── */}
          <section className='home-hero relative overflow-hidden min-h-[calc(100dvh-64px)] flex flex-col items-center justify-center'>
            <div className='relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-4 py-20 md:py-28'>
              {/* 角标徽章 */}
              <div className='mb-6 md:mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--semi-color-border)] bg-[var(--semi-color-bg-1)] text-sm text-[var(--semi-color-text-2)]'>
                <span className='w-1.5 h-1.5 rounded-full bg-[var(--semi-color-primary)] inline-block' />
                <span>{t('企业专属 · 全球顶级模型供应商')}</span>
              </div>

              {/* 主标题 —— 两行均为 9 字，天然对称 */}
              <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--semi-color-text-0)] leading-tight mb-4 md:mb-6 ${isChinese ? 'tracking-tight' : ''}`}>
                <span className='block mb-3 md:mb-4'>{t('低于官方的模型价格')}</span>
                <span className='block shine-text'>{t('领先行业的可用表现')}</span>
              </h1>

              {/* 副标题 */}
              <p className='text-base md:text-lg text-[var(--semi-color-text-2)] mb-8 md:mb-10 max-w-xl leading-relaxed'>
                {t(
                  '比官方直连更优惠的折扣，40+ 主流模型全覆盖，兼容 OpenAI / Anthropic 接口，替换一行 URL 即可完成迁移。',
                )}
              </p>

              {/* BASE URL 复制组件 */}
              <div className='w-full max-w-lg mb-8 md:mb-10'>
                <Input
                  readonly
                  value={serverAddress}
                  className='!rounded-xl'
                  size={isMobile ? 'default' : 'large'}
                  suffix={
                    <div className='flex items-center gap-2'>
                      <ScrollList
                        bodyHeight={32}
                        style={{ border: 'unset', boxShadow: 'unset' }}
                      >
                        <ScrollItem
                          mode='wheel'
                          cycled={true}
                          list={endpointItems}
                          selectedIndex={endpointIndex}
                          onSelect={({ index }) => setEndpointIndex(index)}
                        />
                      </ScrollList>
                      <Button
                        type='primary'
                        onClick={handleCopyBaseURL}
                        icon={<IconCopy />}
                        className='!rounded-lg'
                      />
                    </div>
                  }
                />
              </div>

              {/* CTA 按钮组 */}
              <div className='flex flex-row gap-3 justify-center items-center'>
                <Link to='/console'>
                  <Button
                    theme='solid'
                    type='primary'
                    size={isMobile ? 'default' : 'large'}
                    className='!rounded-xl px-8'
                    icon={<IconPlay />}
                  >
                    {t('获取密钥')}
                  </Button>
                </Link>
                {isDemoSiteMode && statusState?.status?.version ? (
                  <Button
                    size={isMobile ? 'default' : 'large'}
                    className='!rounded-xl px-6'
                    icon={<IconGithubLogo />}
                    onClick={() =>
                      window.open(
                        'https://github.com/QuantumNous/new-api',
                        '_blank',
                      )
                    }
                  >
                    {statusState.status.version}
                  </Button>
                ) : (
                  docsLink && (
                    <Button
                      size={isMobile ? 'default' : 'large'}
                      className='!rounded-xl px-6'
                      icon={<IconFile />}
                      onClick={() => window.open(docsLink, '_blank')}
                    >
                      {t('文档')}
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* Hero 底部渐隐分割线 */}
            <div className='absolute bottom-0 left-0 right-0 h-px bg-[var(--semi-color-border)]' />
          </section>

          {/* ── 核心优势 ── */}
          <section className='py-16 md:py-24 px-4 bg-[var(--semi-color-bg-0)]'>
            <div className='max-w-6xl mx-auto'>
              {/* 区块标题 */}
              <div className='text-center mb-10 md:mb-14'>
                <p className='text-xs uppercase tracking-widest text-[var(--semi-color-primary)] font-semibold mb-3'>
                  {t('核心优势')}
                </p>
                <h2
                  className={`text-2xl md:text-3xl font-bold text-[var(--semi-color-text-0)] mb-3 ${isChinese ? 'tracking-tight' : ''}`}
                >
                  {t('为什么选择我们')}
                </h2>
                <p className='text-[var(--semi-color-text-2)] max-w-md mx-auto text-sm md:text-base'>
                  {t('专注为企业提供高质量、低成本的大模型接入服务')}
                </p>
              </div>

              {/* 特性卡片网格 */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5'>
                {FEATURES.map((item) => (
                  <div
                    key={item.title}
                    className='group p-6 rounded-xl border border-[var(--semi-color-border)] bg-[var(--semi-color-bg-1)] hover:border-[var(--semi-color-primary)] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(184,120,8,0.08)] cursor-default'
                  >
                    {/* 图标容器 */}
                    <div className='w-10 h-10 rounded-lg bg-[var(--semi-color-primary-light-default)] text-[var(--semi-color-primary)] flex items-center justify-center mb-4 group-hover:bg-[var(--semi-color-primary-light-hover)] transition-colors duration-200'>
                      {item.icon}
                    </div>
                    <h3 className='text-[var(--semi-color-text-0)] font-semibold mb-2 text-sm md:text-base'>
                      {t(item.title)}
                    </h3>
                    <p className='text-[var(--semi-color-text-2)] text-sm leading-relaxed'>
                      {t(item.desc)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 支持的供应商 ── */}
          <section className='py-14 md:py-20 px-4 border-t border-[var(--semi-color-border)] bg-[var(--semi-color-bg-0)]'>
            <div className='max-w-6xl mx-auto'>
              <div className='flex items-center justify-center mb-8 md:mb-10'>
                <Text
                  type='tertiary'
                  className='text-base md:text-lg font-light'
                >
                  {t('支持众多的大模型供应商')}
                </Text>
              </div>

              <div className='flex flex-wrap items-center justify-center gap-4 sm:gap-5 md:gap-7 lg:gap-8 max-w-5xl mx-auto'>
                {PROVIDERS.map(({ key, el }) => (
                  <div
                    key={key}
                    className='w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-200'
                  >
                    {el}
                  </div>
                ))}
                <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center'>
                  <Text className='!text-lg sm:!text-xl md:!text-2xl font-bold text-[var(--semi-color-text-2)]'>
                    30+
                  </Text>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className='overflow-x-hidden w-full'>
          {homePageContent.startsWith('https://') ? (
            <iframe
              src={homePageContent}
              className='w-full h-screen border-none'
            />
          ) : (
            <div
              className='mt-[60px]'
              dangerouslySetInnerHTML={{ __html: homePageContent }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
