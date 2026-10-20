import { Link } from '@inertiajs/react'

import { cn } from '@workspace/ui/lib/utils'

import { isSection, type NavMainItem } from '#common/ui/types/navigation'
import HeaderDropdown from '#common/ui/components/header_dropdown'
import useCan from '#common/ui/hooks/use_can'
import useCurrentUrl, { isNavItemActive } from '#common/ui/hooks/use_is_active'

export interface NavHeaderMainProps {
  items: NavMainItem[]
}

// Tabs on the red band: ink-tinted (keeps small cream text above AA on the
// brand red), cream "card" when active.
const linkBase =
  'flex h-9 w-max items-center justify-center border-2 border-transparent bg-ember/20 px-3 text-[13px] font-bold whitespace-nowrap transition-colors hover:bg-ember/35 focus-visible:bg-ember/35 outline-none'
const linkActive =
  'bg-cream text-ember border-ember shadow-[3px_3px_0_var(--ember)] hover:bg-cream focus-visible:bg-cream'

const subLinkBase =
  'flex select-none items-center space-x-2 rounded-md px-2 py-1.5 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
const subLinkActive = 'bg-accent text-accent-foreground font-medium'

export function NavHeaderMain({ items }: NavHeaderMainProps) {
  const can = useCan()
  const currentUrl = useCurrentUrl()

  return (
    <nav className="flex items-center space-x-4">
      {items.map((item) => {
        if (isSection(item)) {
          const visibleItems = item.items.filter((subItem) => !subItem.can || can[subItem.can])

          if (visibleItems.length === 0) {
            return null
          }

          const sectionHasActive = visibleItems.some((subItem) =>
            isNavItemActive(subItem.url, currentUrl)
          )

          return (
            <HeaderDropdown
              key={item.title}
              trigger={
                <div
                  className={cn(
                    'flex items-center rounded-md px-3 py-1.5 text-sm font-medium',
                    sectionHasActive && 'bg-accent/60 text-accent-foreground'
                  )}
                >
                  {item.title}
                </div>
              }
              width={visibleItems.length > 5 ? 'w-[220px]' : 'w-[180px]'}
              content={
                <div className="grid gap-1 p-2">
                  {visibleItems.map((subItem) => {
                    const active = isNavItemActive(subItem.url, currentUrl)
                    if (subItem.external) {
                      return (
                        <a
                          key={subItem.url}
                          href={subItem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={subLinkBase}
                        >
                          {subItem.icon && <subItem.icon className="h-4 w-4 shrink-0" />}
                          <span>{subItem.title}</span>
                        </a>
                      )
                    }
                    return (
                      <Link
                        key={subItem.url}
                        href={subItem.url}
                        className={cn(subLinkBase, active && subLinkActive)}
                      >
                        {subItem.icon && <subItem.icon className="h-4 w-4 shrink-0" />}
                        <span>{subItem.title}</span>
                      </Link>
                    )
                  })}
                </div>
              }
            />
          )
        }

        if (item.can && !can[item.can]) return null

        const active = isNavItemActive(item.url, currentUrl)

        if (item.external) {
          return (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={linkBase}
            >
              {item.icon && <item.icon className="mr-2 h-4 w-4 shrink-0" />}
              {item.title}
            </a>
          )
        }
        return (
          <Link key={item.url} href={item.url} className={cn(linkBase, active && linkActive)}>
            {item.icon && <item.icon className="mr-2 h-4 w-4 shrink-0" />}
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
