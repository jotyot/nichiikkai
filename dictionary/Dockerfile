# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# copy everything else and build app
COPY . .
WORKDIR /source
RUN dotnet publish -c release -o /app 

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app ./
ENTRYPOINT ["dotnet", "Dictionary.dll"]

# docker build -t us-west1-docker.pkg.dev/nichiikkai/docker/dictionary-image .
# docker run --env-file .env --rm -it -p 5001:8080 us-west1-docker.pkg.dev/nichiikkai/docker/dictionary-image 
# docker push us-west1-docker.pkg.dev/nichiikkai/docker/dictionary-image