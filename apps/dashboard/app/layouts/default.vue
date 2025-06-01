<template>
  <AppWrapper>
    <template #footer>
      <Footer />
    </template>
    <Navigation />
    <Container class="mt-36">
      <slot />
    </Container>
  </AppWrapper>
</template>
