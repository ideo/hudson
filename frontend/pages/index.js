import { Box, Heading, Button } from 'rebass'
import { ThemeProvider } from 'styled-components'
import theme from '../theme';

export default props =>
  <ThemeProvider theme={theme}>
    <Box>
      <Heading color='blue'>Hello</Heading>
      <Button>Rebass</Button>
    </Box>
  </ThemeProvider>