import { NavLink } from 'react-router-dom';

const icons = {
  home: '🏠',
  target: '🎯',
  medal: '🏅',
  user: '👤',
};

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
        {icons.home}
      </NavLink>
      <NavLink to="/challenges" className={({ isActive }) => (isActive ? 'active' : '')}>
        {icons.target}
      </NavLink>
      <NavLink to="/badges" className={({ isActive }) => (isActive ? 'active' : '')}>
        {icons.medal}
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
        {icons.user}
      </NavLink>
    </nav>
  );
}