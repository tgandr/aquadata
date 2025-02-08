using Aquadata.EndToEndTests.Api.Base;

namespace Aquadata.EndToEndTests.Api.Authorization;

[CollectionDefinition(nameof(AuthenticationTestFixture))]
public class AuthenticationTestFixture: 
BaseFixture, ICollectionFixture<AuthenticationTestFixture>
{}
