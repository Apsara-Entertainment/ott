import { ColorRing } from 'react-loader-spinner'

export default function Spinner() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/75 z-50">
      <div className="flex items-center justify-center h-screen">
        <ColorRing
          visible={true}
          height="150"
          width="150"
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
        />
      </div>
    </div>
  );
}
