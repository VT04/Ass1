import Dropzone from '../../el/VideoSection/VideoSection';
import Navbar from '../../el/Menu/Menu';
import './Upload.css'

function Upload() {
  return (
    <section className='section'>
      <Navbar />
      <div className='container'>

        <Dropzone className='p-16 mt-10 border border-neutral-200 d-flex justify-content-center align-items-center' />
      </div>
    </section>
  );
}

export default Upload;
