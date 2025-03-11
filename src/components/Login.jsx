import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { app } from '../config/Firebase'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../config/Firebase'
import { Container, Box, TextField, Button, Typography, Grid, useMediaQuery, useTheme } from '@mui/material'
import loginn from '../../public/loginn.png'

const auth = getAuth(app)

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')) 

  const handleLogin = async e => {
    e.preventDefault()
    setError('')

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log('Successfully logged in:', userCredential.user)

      const userId = userCredential.user.uid
      const userDocRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        const userData = userDoc.data()
        const userRole = userData.role

        console.log('User role:', userRole)
        localStorage.setItem('userRole', userRole)
        navigate('/sales')
      } else {
        setError('User role not found. Please contact the administrator.')
      }

      setEmail('')
      setPassword('')
    } catch (error) {
      console.error('Error logging in:', error)
      setError('Incorrect Email or Password')
    }
  }

  return (
    <Container
      component='main'
      maxWidth
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : 'row' 
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: `url(${loginn})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.9, 
          minHeight: isSmallScreen ? '40vh' : '100vh'
        }}
      />

     
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isSmallScreen ? 4 : 6,
          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
          boxShadow: 3,
          minHeight: isSmallScreen ? '60vh' : '100vh'
        }}
      >
        <Typography component='h1' variant='h5' sx={{ mb: 3, fontWeight: 'bold' }}>
          Welcome Back, Login Here
        </Typography>

        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                id='email'
                label='Email'
                name='email'
                autoComplete='email'
                autoFocus
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography color='error' sx={{ textAlign: 'center', mt: 1 }}>
                  {error}
                </Typography>
              </Grid>
            )}
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{
              backgroundColor: 'grey',
              color: 'white',
              '&:hover': { backgroundColor: 'darkgrey' },
              marginTop: 3,
              padding: 1.5,
              fontWeight: 'bold'
            }}
          >
            Login
          </Button>
        </form>

        <Box sx={{ marginTop: 2, textAlign: 'center' }}>
          <Typography variant='body2'>
            Don't have an account?{' '}
            <Link
              to='/register'
              style={{
                textDecoration: 'none',
                color: theme.palette.grey[700],
                fontWeight: 'bold'
              }}
            >
              Register
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}

export default Login
