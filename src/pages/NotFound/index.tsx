import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logoImage from '../../assets/images/logo.svg';
import logoDarkImage from '../../assets/images/logo-dark.svg';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../../components/Button';
import './styles.scss';
import { fadeInUp, stagger } from '../../styles/animation';

function NotFound() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return(
    <motion.div 
      id='page-notfound' 
      className={theme}
      variants={stagger}
      initial='initial'
      animate='animate'
      exit={{ opacity: 0 }}
    >
      <motion.main variants={fadeInUp} >
        <div className='container'>
          <img src={theme === 'light' ? logoImage : logoDarkImage} alt='Letmeask' />
          <h2>Error 404: Page not found</h2>
          <Button type='submit' onClick={() => navigate('/')}>Voltar</Button>
        </div>
      </motion.main>
    </motion.div>
  );
}

export { NotFound };