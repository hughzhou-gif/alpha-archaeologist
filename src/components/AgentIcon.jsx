import { Search, Anchor, Landmark, MessageCircle, BarChart2, CheckCircle, FlaskConical, Target, ScanSearch } from 'lucide-react'

const ICON_MAP = {
  'search': Search,
  'anchor': Anchor,
  'landmark': Landmark,
  'message-circle': MessageCircle,
  'bar-chart-2': BarChart2,
  'check-circle': CheckCircle,
  'flask-conical': FlaskConical,
  'target': Target,
  'scan-search': ScanSearch,
}

export default function AgentIcon({ name, color, size = 14 }) {
  const Icon = ICON_MAP[name]
  if (!Icon) return null
  return <Icon size={size} strokeWidth={1.5} style={{ color, flexShrink: 0 }} />
}
