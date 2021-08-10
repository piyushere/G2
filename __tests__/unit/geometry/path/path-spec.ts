import { Canvas, Group } from '@antv/g';
import { Renderer } from '@antv/g-canvas';
import { createDiv } from '../../../util/dom';
import { Path } from '../../../../src/geometry/path';
import { Element } from '../../../../src/geometry/element';
import { Category, Linear } from '../../../../src/visual/scale';
import { Rect } from '../../../../src/visual/coordinate';

const canvasRenderer = new Renderer();

const canvas = new Canvas({
  container: createDiv(),
  width: 400,
  height: 200,
  renderer: canvasRenderer,
});

const container = new Group();

canvas.appendChild(container);

const data = [7.22, 2.4269, 2.0484, 8.0495, 8.2496, 1.707, 5.213, 2.622, 0.8367, 9.0428, 6.7815].map((d, idx) => ({
  x: `${idx}`,
  y: d,
}));

const scales = new Map();
scales.set('x', new Category({ field: 'x', values: data.map((d) => d.x) }));
scales.set('y', new Linear({ field: 'y', min: 0, max: 15 }));
scales.set('type', new Category({ field: 'type', values: ['一', '二'] }));

describe('path geometry', () => {
  const g = new Path({
    data,
    container,
    scales,
    coordinate: new Rect({
      start: { x: 0, y: 200 },
      end: { x: 400, y: 0 },
    }),
  });

  it('path geometry init', () => {
    g.position('x*y').color(null, 'red');
    g.update({});
    g.paint();

    // @ts-ignore
    expect(g.elementsMap.size).toBe(1);
    // 一条 path
    expect(g.options.container.findAll((obj) => obj.get('type') === 'path').length).toBe(1);
  });

  it('two path', () => {
    container.removeChildren();
    const data2 = [];
    data.forEach((d) => {
      data2.push({ ...d, type: '一' }, { ...d, y: d.y + 2, type: '二' });
    });

    g.color('type', ['red', 'orange']);

    g.update({ data: data2 });
    g.paint();

    // 两条 path
    expect(g.options.container.findAll((obj) => obj.get('type') === 'path').length).toBe(2);
  });

  it('color attr', () => {
    const elements: Element[] = g.getElements();
    // @ts-ignore fixme Element 应该提供获取 shape 的 API
    expect(elements[0].shape.attr('stroke')).toBe('red');
    // @ts-ignore
    expect(elements[1].shape.attr('stroke')).toBe('orange');
  });

  it('style attr', () => {
    container.removeChildren();
    g.style('', { lineDash: [4, 8] });
    g.update({});
    g.paint();

    const elements: Element[] = g.getElements();
    // @ts-ignore
    expect(elements[0].shape.attr('lineDash')).toEqual([4, 8]);
  });
});