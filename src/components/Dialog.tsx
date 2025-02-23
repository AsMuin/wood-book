import { Dialog as DialogPrimitive, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface DialogProps {
    trigger: React.ReactNode;
    title?: string;
    description?: string;
    children: React.ReactNode;
}

function Dialog({ trigger, title, description, children }: DialogProps) {
    return (
        <DialogPrimitive>
            <DialogTrigger>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                {children}
            </DialogContent>
        </DialogPrimitive>
    );
}

export default Dialog;
