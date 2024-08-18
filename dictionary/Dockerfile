FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY . .
ENTRYPOINT ["dotnet", "Published/Dictionary.dll"]

# docker run --rm -it -p 5000:8080 dictionary_service