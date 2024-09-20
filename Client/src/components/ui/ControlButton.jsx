import { Button } from "@/components/ui/button"

const ControlButton = ({ onClick, active, icon, label }) => (
    <Button
        variant="outline"
        onClick={onClick}
        className={`flex items-center px-4 py-2 ${active ? 'bg-red-100 hover:bg-red-200 text-red-600' : 'hover:bg-gray-200'
            } transition-colors duration-200`}
    >
        {icon}
        <span className="ml-2">{label}</span>
    </Button>
)

export {ControlButton}