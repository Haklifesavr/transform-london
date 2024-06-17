import { useState, useEffect } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
// Custom components
import DefaultAuth from 'layouts/auth/Default';
// Assets

import illustrationNight from 'assets/img/auth/london.jpg';
import illustrationDay from 'assets/img/auth/london-day.jpg';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import Cookie from 'js-cookie';
import manager from 'helpers/manager';

function SignIn() {
  // Chakra color mode
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //consts or variables
  const navigate = useNavigate();
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const [show, setShow] = React.useState(false);


  const handleClick = () => setShow(!show);
  const handleSubmit = async (e) => {
    e.preventDefault();

    Cookie.remove('token');
    setError(null);
    setLoading(true);
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const signin = await manager.signIn(email, password);
    if (signin.ok) {
      // Check if the HTTP request was successful
      const response = await signin.json();
      if (response.access) {
        Cookie.set("token", response.access);
        navigate('/admin');
      } else {
        setLoading(false);
        setError('Sorry, we messed up');
      }
    } else {
      setLoading(false);
      setError('Sorry, there was an error during sign-in');
    }
  };

  //Check if there is token then try to signin
  const token = Cookie.get('token');
  if (token) {
    navigate('/admin');
  }

  return (
    <DefaultAuth illustrationBackgroundDay={illustrationDay} illustrationBackgroundNight={illustrationNight}>
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w='100%'
        mx={{ base: 'auto', lg: '0px' }}
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '40px', md: '14vh' }}
        flexDirection='column'
      >
        <Box me='auto'>
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Sign In
          </Heading>
          <Text mb='36px' ms='4px' color={textColorSecondary} fontWeight='400' fontSize='md'>
            Enter your email and password to sign in!
          </Text>
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: '100%', md: '420px' }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: 'auto', lg: 'unset' }}
          me='auto'
          mb={{ base: '20px', md: 'auto' }}
        >
          <form onSubmit={handleSubmit} data-testid='signin-form'>
            <FormControl>
              <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' color={textColor} mb='8px'>
                Email<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant='auth'
                fontSize='sm'
                ms={{ base: '0px', md: '0px' }}
                type='email'
                placeholder='example@mail.com'
                mb='24px'
                fontWeight='500'
                size='lg'
                name='email'
              />
              <FormLabel ms='4px' fontSize='sm' fontWeight='500' color={textColor} display='flex'>
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size='md'>
                <Input
                  isRequired={true}
                  fontSize='sm'
                  placeholder='Min. 8 characters'
                  mb='24px'
                  size='lg'
                  type={show ? 'text' : 'password'}
                  variant='auth'
                  name='password'
                />
                <InputRightElement display='flex' alignItems='center' mt='4px'>
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: 'pointer' }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              <Flex justifyContent='space-between' align='center' mb='24px'></Flex>
              <Button
                isLoading={loading}
                type='submit'
                fontSize='sm'
                variant='brand'
                fontWeight='500'
                boxShadow='none'
                w='100%'
                h='50'
                mb='24px'
              >
                Sign In
              </Button>
              {error ? <font color='red'>{error}</font> : <font></font>}
            </FormControl>
          </form>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
