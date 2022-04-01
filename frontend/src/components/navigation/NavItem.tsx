import { LinkProps, NavLink } from 'react-router-dom'

interface NavItemProps extends LinkProps {
    text: string
    color?: string
}

export const NavItem = (props: NavItemProps) => {
    return (
        <NavLink {...props} className="nav-item" style={{ color: props.color }}>
            {props.text}
        </NavLink>
    )
}
