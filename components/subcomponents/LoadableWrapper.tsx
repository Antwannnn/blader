import { PageLoader } from "./Loader"

type LoadableWrapperProps = {
    condition: boolean,
    clasName?: string,
    children: React.ReactNode,
}

const LoadableWrapper = ({children, clasName, condition}: LoadableWrapperProps) => {
  return (
    <section className={clasName}>
     {condition ? children : <PageLoader className='flex flex-col items-center justify-center gap-5' />}   
    </section>
  )
}

export default LoadableWrapper