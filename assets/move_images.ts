import { copyFile, readdir } from 'fs/promises'
import { resolve } from 'path'

const recurseCopy = async (path: string) => {
    const paths = await readdir(path)
    paths.forEach(p => {
        if (p.endsWith('.png') || p.endsWith('.jpg') || p.endsWith('.jpeg') || p.endsWith('.gif') || p.endsWith('.svg')) {
            copyFile(resolve(path, p), resolve('./docs/assets/images', p))
        } else recurseCopy(resolve(path, p))
    })
}

recurseCopy('./assets/images')