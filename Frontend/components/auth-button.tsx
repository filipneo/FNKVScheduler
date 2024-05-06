import { Link } from '@/navigation'

import { User } from 'lucide-react'

import { Button } from './ui/button'

export default function AuthButton() {
	return (
		<Link href="/auth">
			<Button variant="outline" size="icon">
				<User className='p-0.5'/>
			</Button>
		</Link>
	)
}