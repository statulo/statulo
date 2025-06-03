<template>
  <AppWrapper>
    <Navigation />
    <Container class="mt-36">
      <slot />
    </Container>
    <template #footer>
      <Footer />
    </template>
  </AppWrapper>
</template>
