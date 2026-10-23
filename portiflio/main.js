/**
 * PORTFÓLIO INTERATIVO | JAVASCRIPT PRINCIPAL (main.js)
 * Funcionalidades:
 * 1. Cenário 3D WebGL em Three.js (Overworld Audio & Leo Parpeix)
 * 2. Objeto 3D Central Orgânico/Cromado com Iluminação Volumétrica
 * 3. Partículas Cibernéticas Flutuantes
 * 4. Paralaxe 3D do Título Cromado Sensível ao Mouse (Ascension Pegassi)
 * 5. Cursor Personalizado com Inércia Suave (Production Portugal)
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================
  // 1. CURSOR PERSONALIZADO COM INÉRCIA (LERP)
  // ==========================================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;

    // Atualiza posição imediata do ponto central
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  // Animação com amortecimento físico para o anel do cursor
  function animateCursor() {
    // Interpolação suave (lerp)
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;

    if (cursorRing) {
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
    }

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Estados de hover do cursor em elementos interativos
  const interactiveElements = document.querySelectorAll('.interactive-hover, a, button');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-active');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-active');
    });
  });


  // ==========================================================
  // 2. PARALAXE 3D DO TÍTULO E ELEMENTOS HERO
  // ==========================================================
  const parallaxContainer = document.getElementById('heroParallaxContainer');
  let targetTiltX = 0;
  let targetTiltY = 0;
  let currentTiltX = 0;
  let currentTiltY = 0;

  window.addEventListener('mousemove', (e) => {
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;

    // Normalizado entre -1 e 1
    const normX = (e.clientX - halfWidth) / halfWidth;
    const normY = (e.clientY - halfHeight) / halfHeight;

    // Limites de inclinação em graus
    targetTiltX = -normY * 12; // inclina no eixo X
    targetTiltY = normX * 16;  // inclina no eixo Y
  });

  function updateParallax() {
    currentTiltX += (targetTiltX - currentTiltX) * 0.08;
    currentTiltY += (targetTiltY - currentTiltY) * 0.08;

    if (parallaxContainer) {
      parallaxContainer.style.transform = `perspective(1000px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg)`;
    }

    requestAnimationFrame(updateParallax);
  }
  updateParallax();


  // ==========================================================
  // 3. CENÁRIO 3D IMERSIVO COM THREE.JS
  // ==========================================================
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') {
    console.warn('Three.js não carregado ou canvas inexistente.');
    return;
  }

  // Cena, Câmera e Renderizador
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x09080D, 0.04);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 7.5;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Iluminação Sci-Fi e Metálica
  const ambientLight = new THREE.AmbientLight(0x181528, 1.8);
  scene.add(ambientLight);

  // Luz Direcional Prateada Metálica
  const chromeLight = new THREE.DirectionalLight(0xE6E6FA, 2.5);
  chromeLight.position.set(5, 6, 4);
  scene.add(chromeLight);

  // Luz Pontual Rosa Neon Soft Glow
  const pinkPointLight = new THREE.PointLight(0xFFB7C5, 3.5, 15);
  pinkPointLight.position.set(-4, -2, 3);
  scene.add(pinkPointLight);

  // Luz Pontual Secundária Rosa Bebê Acetinado
  const satinLight = new THREE.PointLight(0xF4C2C2, 2.0, 12);
  satinLight.position.set(2, -3, 2);
  scene.add(satinLight);

  // Objeto Central 3D Escultural Orgânico (Torus Knot Acetinado/Cromado)
  const geometry = new THREE.TorusKnotGeometry(1.65, 0.42, 140, 28, 2, 3);
  const material = new THREE.MeshStandardMaterial({
    color: 0xE6E6FA,
    metalness: 0.92,
    roughness: 0.18,
    wireframe: false
  });
  const centralSculpture = new THREE.Mesh(geometry, material);
  scene.add(centralSculpture);

  // Wireframe Sutil Sobreposto para Toque Tecnológico Futurista
  const wireGeometry = new THREE.TorusKnotGeometry(1.67, 0.425, 60, 16, 2, 3);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFB7C5,
    wireframe: true,
    transparent: true,
    opacity: 0.08
  });
  const wireOverlay = new THREE.Mesh(wireGeometry, wireMaterial);
  centralSculpture.add(wireOverlay);

  // Sistema de Partículas Cibernéticas (Poeira Estelar / Cyber Mist)
  const particleCount = 750;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  const colorChrome = new THREE.Color(0xE6E6FA);
  const colorPink = new THREE.Color(0xFFB7C5);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    particlePositions[i3] = (Math.random() - 0.5) * 20;
    particlePositions[i3 + 1] = (Math.random() - 0.5) * 20;
    particlePositions[i3 + 2] = (Math.random() - 0.5) * 16;

    // Alterna cores entre Prata Cromado e Rosa Neon Suave
    const mixedColor = Math.random() > 0.4 ? colorChrome : colorPink;
    particleColors[i3] = mixedColor.r;
    particleColors[i3 + 1] = mixedColor.g;
    particleColors[i3 + 2] = mixedColor.b;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // Rastreamento de Mouse para o Cenário 3D
  let targetSceneMouseX = 0;
  let targetSceneMouseY = 0;
  let currentSceneMouseX = 0;
  let currentSceneMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetSceneMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetSceneMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Loop Principal de Renderização Three.js
  let clock = new THREE.Clock();

  function renderThreeScene() {
    const elapsedTime = clock.getElapsedTime();

    // Suavização do movimento do mouse para o 3D
    currentSceneMouseX += (targetSceneMouseX - currentSceneMouseX) * 0.05;
    currentSceneMouseY += (targetSceneMouseY - currentSceneMouseY) * 0.05;

    // Rotação suave contínua + reação às coordenadas do cursor
    centralSculpture.rotation.x = elapsedTime * 0.22 + currentSceneMouseY * 0.45;
    centralSculpture.rotation.y = elapsedTime * 0.28 + currentSceneMouseX * 0.55;

    // Movimentação orbital suave da luz rosa neon
    pinkPointLight.position.x = Math.sin(elapsedTime * 0.8) * 4.5;
    pinkPointLight.position.y = Math.cos(elapsedTime * 0.6) * 3.5;

    // Rotação sutil da poeira estelar
    particleSystem.rotation.y = elapsedTime * 0.04;
    particleSystem.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;

    // Câmera reage suavemente à navegação
    camera.position.x = currentSceneMouseX * 0.4;
    camera.position.y = currentSceneMouseY * 0.3;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(renderThreeScene);
  }
  renderThreeScene();

  // Redimensionamento Dinâmico da Janela
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

});
