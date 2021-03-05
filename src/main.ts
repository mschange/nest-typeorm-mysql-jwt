import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


// 自定义端口
const PORT = process.env.PORT || 5000

// 打印日志
function logger(req, res, next) {
  const { method, path } = req;
  console.log(`${method} - ${path}`)
  next();
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true, // 跨域
    logger: false
  });
  app.use(logger)
  await app.listen(PORT);
  // 控制台输出
   Logger.log(`Server running on http://192.168.31.77:${PORT}`, 'Bootstrap')
}
bootstrap();
