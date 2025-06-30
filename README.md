# mobile-hell-app

A cross‑platform mobile application built with Expo Router and Gluestack UI.

## Requirements

Before you begin, ensure you have the following installed on your system:

- **Node.js** ≥ 18.x  
- **npm** (bundled with Node.js) ≥ 9.x  
- **Docker** ≥ 24.x  
- **Docker Compose** ≥ 2.x  


## Getting Started (Local)

1. **Clone the repo**  
```bash
git clone --recurse-submodules https://github.com/valmtv/mobile-hell-app
cd mobile-hell-app
```
2. **Start automatically**  
```bash
./run.sh
```

3. **Start manually**
```bash
cd hell-app
docker-compose up -d
cd ..
npm run start
```

4. **Important**
- If you git cloned the repository without the `--recurse-submodules` flag, you need to initialize and update the submodules manually. Run the following commands in the root directory of the projec before starting the project
```bash
git submodule init
git submodule update --recursive

```
- If you are using a physical device, ensure that your device is connected to the same network as your computer.
- To stop the application, run:
```bash
docker-compose down
```


