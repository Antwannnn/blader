import { ThreeDots, Puff} from 'react-loader-spinner'

type LoaderProps = {
    className?: string
}

const PageLoader = ({ className }: LoaderProps) => {
  return (
    <div className={className}><Puff
    visible={true}
    height="80"
    width="80"
    color="#CED4DA"
    ariaLabel="puff-loading"
    wrapperStyle={{}}
    wrapperClass="" /></div>
  )
}

const ElementLoader = ({ className }: LoaderProps) => {
    return (
        <div className={className}><ThreeDots
        visible={true}
        height="40"
        width="40"
        color="#CED4DA"
        ariaLabel="puff-loading"
        wrapperStyle={{}}
        wrapperClass="" /></div>
    )
}

export { PageLoader, ElementLoader }