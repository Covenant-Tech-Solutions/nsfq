export async function getUserCountryCode() {
  const country = await fetch(`http://ip-api.com/json`, {
    next: {
      revalidate: 60,
    },
  });

  const data = await country?.json();

  return data?.countryCode;
}
