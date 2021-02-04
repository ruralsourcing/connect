import { useState, useEffect, createContext, useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { SnackBarType } from './withSnackbarContext';

export const snackBarContext = createContext<SnackBarType>({message: '', updateMessage: () => {}});
export const SnackBarProvider = ({
    children,
}: JSX.ElementChildrenAttribute): JSX.Element => {
    const [message, setMessage] = useState('')
    const updateMessage = (m:string) => {
        setMessage(m);
    }
    const [open, setOpen] = useState(true)

    useEffect(() => {
        if (message.length > 0) {
            const timer = setTimeout(() => setOpen(false), 5000)
            return () => clearTimeout(timer)
        }
    })

    return (
        <snackBarContext.Provider value={{ message, updateMessage }}>
            <Snackbar open={open} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} message={message} />
            {children}
        </snackBarContext.Provider>
    )
}