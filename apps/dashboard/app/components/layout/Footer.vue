<template>
  <Container>
    <div class="text-sm flex my-9 justify-center items-center gap-5">
      <p>V2.73.0</p>
      <div
        class="w-px h-5 bg-neutral-400"
      />
      <p class="flex items-center gap-5">
        <SubtleLink :to="urls.termsOfService">
          Terms
        </SubtleLink>
        <SubtleLink :to="urls.privacyPolicy">
          Privacy
        </SubtleLink>
        <SubtleLink :to="urls.contact">
          Contact
        </SubtleLink>
      </p>
    </div>
  </Container>
</template>
