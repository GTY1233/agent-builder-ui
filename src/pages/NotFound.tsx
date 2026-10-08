import { useNavigate } from 'react-router-dom'
import { Page, Section } from '../components/ui/Page'
import { EmptyState } from '../components/ui/EmptyState'

export function NotFound() {
  const navigate = useNavigate()
  return (
    <Page>
      <Section>
        <EmptyState
          icon="search"
          title="这个地址没有对应的页面"
          body="可能是链接过期，或者这一页还没被纳入模版。用 ⌘K 打开命令面板可以搜索到全部页面。"
          action={
            <button className="btn btn--primary" onClick={() => navigate('/')}>
              回到首页
            </button>
          }
        />
      </Section>
    </Page>
  )
}
